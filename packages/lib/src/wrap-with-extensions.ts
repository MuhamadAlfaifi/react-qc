import { QueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TRenderResults, TOptions, TResults, TPath, TBody, TInput } from './types';
import { defaultKeyFn } from './utils';
import { ReactNode } from 'react';
import { useQcExtensions } from '.';

export function wrapWithExtensions<TVariables extends unknown[] = unknown[], TData = unknown, THookFn extends typeof useQuery | typeof useInfiniteQuery = never>(wrappedHook: THookFn, defaultOptions: TOptions<TData, THookFn>, keyFn: any = defaultKeyFn) {

  function useKeyFnWithExtensions(variables: TInput<TVariables>) {
    const { extensions, useExtensions } = useQcExtensions();
    return keyFn(variables, extensions || useExtensions?.() || {});
  }

  function use<T = TData>(variables: TInput<TVariables>, options?: TOptions<T, THookFn>, client?: QueryClient) {
    const query = (wrappedHook as any)({
      queryKey: useKeyFnWithExtensions(variables),
      ...defaultOptions,
      ...options,
    }, client);
    
    return query as TResults<T, THookFn>;
  }

  function Component<T = TData>(
    { path, body, variables, hasLoading, loading, client, render, children, ...options }:
    { path?: TPath<TVariables[0]>, body?: TBody<TVariables[1]>, variables?: TInput<TVariables>, hasLoading?: boolean, loading?: ReactNode, client?: QueryClient, render?: TRenderResults<T, THookFn>, children?: TRenderResults<T, THookFn> } & TOptions<T, THookFn>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    const results = use(variables || ([path, body] as TInput<TVariables>), { throwOnError: true, ...options } as unknown as TOptions<T, THookFn>, client);

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
    useKeyFnWithExtensions,
    keyFn,
    queryFn: defaultOptions.queryFn,
  });
}
