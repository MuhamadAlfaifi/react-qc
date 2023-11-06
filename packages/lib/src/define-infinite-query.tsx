import { UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TKeyFn, TRenderInfiniteResults, TPagesFn, TInfiniteQueryResults } from './types';
import { defaultKeyFn, defaultDataFn } from './utils';
import { ReactNode, useMemo } from 'react';

export function defineInfiniteQueryComponent<TVariables, U = unknown>(defaultOptions: UseInfiniteQueryOptions, keyFn: TKeyFn<TVariables> = defaultKeyFn) {

  function useBaseInfiniteQuery<T = U>(variables: TVariables, dataFn: TPagesFn<T> = defaultDataFn<T>, options?: UseInfiniteQueryOptions): TInfiniteQueryResults<T> {
    const { extensions, useExtensions } = useQcDefaults();

    const query = useInfiniteQuery({
      queryKey: keyFn(variables, extensions || useExtensions?.()),
      ...defaultOptions,
      ...options,
    });

    const data = useMemo<T>(() => {
      if (query.data?.pages) {
        return dataFn(query.data.pages) as T;
      }
      
      return [] as unknown as T;
    }, [query.data, dataFn]);

    return { ...query, data };
  }

  function Component<T = U>(
    { variables = ({} as TVariables), data, hasLoading, loading, render, children, ...props }: 
    { variables: TVariables, data?: TPagesFn<T>, hasLoading?: boolean, loading?: ReactNode, render?: TRenderInfiniteResults<T>, children?: TRenderInfiniteResults<T> } & UseInfiniteQueryOptions<T>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    const results: TInfiniteQueryResults<T> = useBaseInfiniteQuery(variables, data as TPagesFn<T> | undefined, { throwOnError: true, ...props } as UseInfiniteQueryOptions);

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;
    
    const status = results.status as QueryStatusWithPending;
    
    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }

    return render ? render(results) : children ? children(results) : null;
  }

  return Object.assign(Component, { 
    useInfiniteQuery: useBaseInfiniteQuery, 
    keyFn: (options: TVariables) => keyFn(options),
    queryFn: defaultOptions.queryFn,
  });
}
