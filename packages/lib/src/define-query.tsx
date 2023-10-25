import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TKeyFn, TQueryResults, TRenderQueryResults, TDataFn } from './types';
import { defaultKeyFn, defaultDataFn } from './utils';
import { ReactNode, useMemo } from 'react';

export function defineQueryComponent<TVariables, U = unknown>(defaultOptions: UseQueryOptions, keyFn: TKeyFn<TVariables> = defaultKeyFn) {

  function useBaseQuery<T = U>(variables: TVariables, dataFn: TDataFn<T> = defaultDataFn<T>, options?: UseQueryOptions): TQueryResults<T> {
    const { extensions, useExtensions } = useQcDefaults();

    const query = useQuery({
      queryKey: keyFn(variables, extensions || useExtensions?.()),
      ...defaultOptions,
      ...options,
    });

    const data = useMemo<T>(() => {
      if (query.data) {
        return dataFn(query.data) as T;
      }
      
      return undefined as unknown as T;
    }, [query.data, dataFn]);

    return { data, query };
  }

  function Component<T = U>(
    { variables = ({} as TVariables), data, hasLoading, loading, render, children, ...props }: 
    { variables: TVariables, data?: TDataFn<T>, hasLoading?: boolean, loading?: ReactNode, render?: TRenderQueryResults<T>, children?: TRenderQueryResults<T> } & UseQueryOptions<T>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

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
