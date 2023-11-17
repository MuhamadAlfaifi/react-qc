import { QueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TRenderResults, TOptions, TResults } from './types';
import { defaultKeyFn } from './utils';
import { ReactNode } from 'react';

export function wrapWithExtensions<TVariables extends [unknown, unknown], TData = unknown, THookFn extends typeof useQuery | typeof useInfiniteQuery = typeof useQuery | typeof useInfiniteQuery>(wrappedHook: THookFn, defaultOptions: TOptions<TData, THookFn>, keyFn: any = defaultKeyFn) {

  function useKeyFn(variables: TVariables) {
    const { extensions, useExtensions } = useQcDefaults();
    return keyFn(variables, extensions || useExtensions?.() || {});
  }

  function use<T = TData>(variables: TVariables, options?: TOptions<T, THookFn>, client?: QueryClient) {
    const query = (wrappedHook as any)({
      queryKey: useKeyFn(variables),
      ...defaultOptions,
      ...options,
    }, client);
    
    return query as TResults<T, THookFn>;
  }

  function Component<T = TData>(
    { path = (undefined as TVariables[0]), body = (undefined as TVariables[1]), variables = ([undefined, undefined] as TVariables), hasLoading, loading, client, render, children, ...options }: 
    { path?: TVariables[0], body?: TVariables[1], variables?: TVariables, hasLoading?: boolean, loading?: ReactNode, client?: QueryClient, render?: TRenderResults<T, THookFn>, children?: TRenderResults<T, THookFn> } & TOptions<T, THookFn>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    const results = use(([variables[0] || path, variables[1] || body] as TVariables), { throwOnError: true, ...options } as unknown as TOptions<T, THookFn>, client);

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
