import { QueryClient, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TKeyFn, TQueryOptions, TQueryResults, TRenderQueryResults } from './types';
import { defaultKeyFn } from './utils';
import { ReactNode } from 'react';

export function defineQueryComponent<TVariables, U = unknown>(defaultOptions: TQueryOptions<U>, keyFn: TKeyFn<TVariables> = defaultKeyFn) {

  function useKeyFn(variables: TVariables) {
    const { extensions, useExtensions } = useQcDefaults();
    return keyFn(variables, extensions || useExtensions?.());
  }

  function use<T = U>(variables: TVariables, options?: TQueryOptions<T>, client?: QueryClient): TQueryResults<T> {
    // @ts-expect-error
    const query = useQuery<T>({
      queryKey: useKeyFn(variables),
      ...defaultOptions,
      ...options,
    } as UseQueryOptions<T>, client);

    return query as TQueryResults<T>;
  }

  function Component<T = U>(
    { variables = ({} as TVariables), hasLoading, loading, render, children, ...options }: 
    { variables: TVariables, hasLoading?: boolean, loading?: ReactNode, render?: TRenderQueryResults<T>, children?: TRenderQueryResults<T> } & TQueryOptions<T>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    const results: TQueryResults<T> = use(variables, { throwOnError: true, ...options } as TQueryOptions<T>);

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;
    
    const status = results.status as QueryStatusWithPending;
    
    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }

    return render ? render(results) : children ? children(results) : null;
  }

  return Object.assign(Component, { 
    use,
    useKeyFn,
    keyFn,
    queryFn: defaultOptions.queryFn,
  });
}
