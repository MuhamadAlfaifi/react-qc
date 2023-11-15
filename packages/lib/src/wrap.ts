import { QueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TRenderResults, TOptions, TResults } from './types';
import { defaultKeyFn } from './utils';
import { ReactNode } from 'react';

export function wrap<TVariables, U = unknown, K = unknown>(hook: typeof useQuery | typeof useInfiniteQuery, defaultOptions: TOptions<U, K>, keyFn: any = defaultKeyFn) {

  function useKeyFn(variables: TVariables) {
    return keyFn(variables);
  }

  function use<UU = U, KK = K>(variables: TVariables, options?: TOptions<UU, KK>, client?: QueryClient) {
    const query = (hook as any)({
      queryKey: useKeyFn(variables),
      ...defaultOptions,
      ...options,
    } as any, client);
    
    return query as TResults<UU, KK>;
  }

  function Component<UU = U, KK = K>(
    { variables = ({} as TVariables), hasLoading, loading, client, render, children, ...options }: 
    { variables: TVariables, hasLoading?: boolean, loading?: ReactNode, client?: QueryClient, render?: TRenderResults<UU, KK>, children?: TRenderResults<UU, KK> } & TOptions<UU, KK>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    const results = use(variables, { throwOnError: true, ...options } as unknown as TOptions<UU, KK>, client);

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
