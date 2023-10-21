import { UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TKeyFn, TRenderInfiniteResults, TPagesFn, TInfiniteQueryResults, WithExtensions } from './types';
import { defaultKeyFn, defaultDataFn } from './utils';
import { ReactNode, useMemo } from 'react';
import { useExtensions } from './use-extensions';

export function defineInfiniteQueryComponent<TVariables, U = unknown>(defaultOptions: UseInfiniteQueryOptions, keyFn: TKeyFn<WithExtensions<TVariables>> = defaultKeyFn) {

  function useBaseInfiniteQuery<T = U>(variables: WithExtensions<TVariables>, dataFn: TPagesFn<T> = defaultDataFn<T>, options?: UseInfiniteQueryOptions): TInfiniteQueryResults<T> {
    const __extensions = useExtensions(variables.__extensions as string[]);

    const query = useInfiniteQuery({
      queryKey: keyFn({ ...variables, __extensions }),
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
    { variables = ({} as WithExtensions<TVariables>), data, hasLoading, loading, render, children, ...props }: 
    { variables: WithExtensions<TVariables>, data?: TPagesFn<T>, hasLoading?: boolean, loading?: ReactNode, render?: TRenderInfiniteResults<T>, children?: TRenderInfiniteResults<T> } & UseInfiniteQueryOptions<T>
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
    keyFn: (options: WithExtensions<TVariables>) => keyFn(options),
    queryFn: defaultOptions.queryFn,
  });
}
