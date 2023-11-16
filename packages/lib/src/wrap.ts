import { QueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TRenderResults, TOptions, TResults } from './types';
import { defaultKeyFn } from './utils';
import { ReactNode } from 'react';

export function wrap<TVariables extends [unknown, unknown], U = unknown>(hook: typeof useQuery | typeof useInfiniteQuery, defaultOptions: TOptions<U, typeof hook>, keyFn: any = defaultKeyFn) {

  function useKeyFn(variables: TVariables) {
    return keyFn(variables);
  }

  function use<UU = U>(variables: TVariables, options?: TOptions<UU, typeof hook>, client?: QueryClient) {
    const query = (hook as any)(variables, {
      queryKey: useKeyFn(variables),
      ...defaultOptions,
      ...options,
    } as TOptions<typeof hook>, client);
    
    return query as TResults<UU, typeof hook>;
  }

  function Component<UU = U>(
    { path = (undefined as TVariables[0]), body = (undefined as TVariables[1]), variables = ([undefined, undefined] as TVariables), hasLoading, loading, client, render, children, ...options }: 
    { path?: TVariables[0], body?: TVariables[1], variables?: TVariables, hasLoading?: boolean, loading?: ReactNode, client?: QueryClient, render?: TRenderResults<UU, typeof hook>, children?: TRenderResults<UU, typeof hook> } & TOptions<UU, typeof hook>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    const results = use(([variables[0] || path, variables[1] || body] as TVariables), { throwOnError: true, ...options } as unknown as TOptions<UU, typeof hook>, client);

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
