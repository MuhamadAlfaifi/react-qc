import { UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TKeyFn, TRenderInfiniteResults, TPagesFn, TInfiniteQueryResults, WithExtMiddlware, WithResolvedExt, TExtMiddleware, TResolvedExt } from './types';
import { defaultKeyFn, defaultDataFn } from './utils';
import { ReactNode, useMemo } from 'react';
import { useExtensions } from './use-extensions';

export function defineInfiniteQueryComponent<TVariables, U = unknown>(defaultOptions: UseInfiniteQueryOptions, keyFn: TKeyFn<WithResolvedExt<TVariables>> = defaultKeyFn) {

  function useBaseInfiniteQuery<T = U>(variables: WithExtMiddlware<TVariables>, dataFn: TPagesFn<T> = defaultDataFn<T>, options?: UseInfiniteQueryOptions): TInfiniteQueryResults<T> {
    const __ext = useExtensions<TExtMiddleware, TResolvedExt>(variables.__ext);

    const query = useInfiniteQuery({
      queryKey: keyFn({ ...variables, __ext }),
      ...defaultOptions,
      ...options,
    });

    const data = useMemo<T>(() => {
      // @ts-expect-error
      if (query.isLoading || query.isPending) {
        return undefined as unknown as T;
      }
      
      return dataFn?.(query.data?.pages || []) || query.data as T;
      // @ts-expect-error
    }, [query.data, dataFn, query.isLoading, query.isPending]);

    return { data, query };
  }

  function Component<T = U>(
    { variables = ({} as WithExtMiddlware<TVariables>), data, hasLoading, loading, render, children, ...props }: 
    { variables: WithExtMiddlware<TVariables>, data?: TPagesFn<T>, hasLoading?: boolean, loading?: ReactNode, render?: TRenderInfiniteResults<T>, children?: TRenderInfiniteResults<T> } & UseInfiniteQueryOptions<T>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    const results: TInfiniteQueryResults<T> = useBaseInfiniteQuery(variables, data as TPagesFn<T> | undefined, { throwOnError: true, ...props } as UseInfiniteQueryOptions);

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;
    
    const status = results.query.status as QueryStatusWithPending;
    
    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }

    return render ? render(results) : children ? children(results) : null;
  }

  return Object.assign(Component, { 
    useInfiniteQuery: useBaseInfiniteQuery, 
    keyFn: (options: WithResolvedExt<TVariables>) => keyFn(options),
    queryFn: defaultOptions.queryFn,
  });
}
