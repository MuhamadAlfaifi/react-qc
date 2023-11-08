import { QueryClient, UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TKeyFn, TRenderInfiniteResults, TInfiniteQueryResults, TInfiniteQueryOptions } from './types';
import { defaultKeyFn } from './utils';
import { ReactNode } from 'react';

export function defineInfiniteQueryComponent<TVariables, U = unknown>(defaultOptions: TInfiniteQueryOptions<U>, keyFn: TKeyFn<TVariables> = defaultKeyFn) {

  function useKeyFn(variables: TVariables) {
    const { extensions, useExtensions } = useQcDefaults();
    return keyFn(variables, extensions || useExtensions?.());
  }

  function use<T = U>(variables: TVariables, options?: TInfiniteQueryOptions<T>, client?: QueryClient) {
    // @ts-expect-error
    const query = useInfiniteQuery({
      queryKey: useKeyFn(variables),
      ...defaultOptions,
      ...options,
    } as UseInfiniteQueryOptions, client);
    
    return query as TInfiniteQueryResults<T>;
  }

  function Component<T = U>(
    { variables = ({} as TVariables), hasLoading, loading, client, render, children, ...options }: 
    { variables: TVariables, hasLoading?: boolean, loading?: ReactNode, client?: QueryClient, render?: TRenderInfiniteResults<T>, children?: TRenderInfiniteResults<T> } & TInfiniteQueryOptions<T>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    const results = use(variables, { throwOnError: true, ...options } as TInfiniteQueryOptions<T>, client);

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
