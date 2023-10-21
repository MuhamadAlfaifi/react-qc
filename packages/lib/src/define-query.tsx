import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TKeyFn, TQueryResults, TRenderQueryResults, TDataFn, WithResolvedUse, WithUnresolvedUse, TUnresolvedUse, TResolvedUse } from './types';
import { defaultKeyFn, defaultDataFn } from './utils';
import { ReactNode, useMemo } from 'react';
import { useExtensions } from './use-extensions';

export function defineQueryComponent<TVariables, U = unknown>(defaultOptions: UseQueryOptions, keyFn: TKeyFn<WithResolvedUse<TVariables>> = defaultKeyFn) {

  function useBaseQuery<T = U>(variables: WithUnresolvedUse<TVariables>, dataFn: TDataFn<T> = defaultDataFn<T>, options?: UseQueryOptions): TQueryResults<T> {
    const __use = useExtensions<TUnresolvedUse, TResolvedUse>(variables.__use);
    
    const query = useQuery({
      queryKey: keyFn({ ...variables, __use }),
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
    { variables = ({} as WithUnresolvedUse<TVariables>), data, hasLoading, loading, render, children, ...props }: 
    { variables: WithUnresolvedUse<TVariables>, data?: TDataFn<T>, hasLoading?: boolean, loading?: ReactNode, render?: TRenderQueryResults<T>, children?: TRenderQueryResults<T> } & UseQueryOptions<T>
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
    keyFn: (options: WithResolvedUse<TVariables>) => keyFn(options),
    queryFn: defaultOptions.queryFn,
  });
}
