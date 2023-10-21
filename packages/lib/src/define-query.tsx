import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useDefaultLoadingError } from './default-loading-error-provider';
import { QueryStatusWithPending, TKeyFn, TQueryResults, TRenderResults, TDataFn } from './types';
import { defaultKeyFn, defaultDataFn } from './utils';
import { ReactNode, useMemo } from 'react';

export function defineQueryComponent<TVariables, U = unknown>(defaultOptions: UseQueryOptions, keyFn: TKeyFn<TVariables> = defaultKeyFn) {

  function useBaseQuery<T = U>(variables: TVariables, dataFn: TDataFn<T> = defaultDataFn<T>, options?: UseQueryOptions): TQueryResults<T> {
    const query = useQuery({
      queryKey: keyFn(variables),
      ...defaultOptions,
      ...options,
    });

    const data = useMemo<T>(() => {
      // @ts-expect-error
      if (query.isLoading || query.isPending) {
        return undefined as unknown as T;
      }
      
      return dataFn?.(query.data) || query.data as T;
      // @ts-expect-error
    }, [query.data, dataFn, query.isLoading, query.isPending]);

    return { data, query };
  }

  function Component<T = U>(
    { variables = ({} as TVariables), data, hasLoading, loading, render, children, ...props }: 
    { variables: TVariables, data?: TDataFn<T>, hasLoading?: boolean, loading?: ReactNode, render?: TRenderResults<T>, children?: TRenderResults<T> } & UseQueryOptions<T>
  ) {
    const { loading: defaultLoading } = useDefaultLoadingError();

    const results: TQueryResults<T> = useBaseQuery(variables, data as TDataFn<T> | undefined, { throwOnError: true, ...props } as UseQueryOptions);

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;
    
    const status = results.query.status as QueryStatusWithPending;
    
    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }

    return render ? render(results) : children ? children(results) : null;
  }

  return Object.assign(Component, { 
    useQuery: useBaseQuery, 
    keyFn: (options: TVariables) => keyFn(options),
    queryFn: defaultOptions.queryFn,
  });
}
