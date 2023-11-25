import { InfiniteData, QueryClient, QueryKey, UseInfiniteQueryOptions, UseInfiniteQueryResult, UseQueryOptions, UseQueryResult, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useQcDefaults } from './qc-provider';
import { QueryStatusWithPending, TVariableFn } from './types';
import { ReactNode } from 'react';
import { detectReactQueryVersion } from './utils';
import { defaultKeyFn } from './default-key-fn';

export function defineUseQuery<TVariables extends QueryKey = QueryKey, TQueryFnData = any, TError = any, TData = TQueryFnData>(
  defaultOptions: UseQueryOptions<TQueryFnData, TError, TData, TVariables>,
  keyFn: any = defaultKeyFn
) {
  function use<T = TData>(
    variables: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables, 
    options?: UseQueryOptions<TQueryFnData, TError, T, TVariables>, 
    client?: QueryClient
  ) {
    
    // Create the query key using the provided keyFn function
    const queryKey = keyFn(variables);

    // Combine the defaultOptions and the options provided at runtime
    const mergedOptions = {
      ...defaultOptions,
      ...options
    } as UseQueryOptions<TQueryFnData, TError, T, TVariables>;

    return useQuery<TQueryFnData, TError, T, TVariables>({
      // @ts-ignore
      queryKey,
      ...mergedOptions
    }, client);
  }

  function Component<T = TData>(
    { path, body, variables, hasLoading, loading, render, children, client, ...options }:
    { path?: TVariableFn<TVariables[0]> | TVariables[0], body?: TVariableFn<TVariables[1]> | TVariables[1], variables?: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables, hasLoading?: boolean, loading?: ReactNode, render?: (data: T, results: UseQueryResult<T, TError>) => ReactNode, children?: (data: T, results: UseQueryResult<T, TError>) => ReactNode } & { client?: QueryClient, } & UseQueryOptions<TQueryFnData, TError, T, TVariables>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    // organize the variables into an array and fix type mismatches caused by path and body props
    const _variables = [path, body, ...(Array.isArray(variables) ? variables : [variables])].filter(Boolean) as TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables;
  
    const results = use(_variables, { ...(detectReactQueryVersion() === 5 ? { throwOnError: true } : { useErrorBoundary: true }), ...options }, client);
  
    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;

    const status = results.status as QueryStatusWithPending;
  
    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }
  
    return render ? render(results.data as T, results) : children ? children(results.data as T, results) : null;
  }
  

  return Object.assign(Component, {
    use, 
    useKeyFn: keyFn,
    keyFn,
    defaultQuerKey: defaultOptions.queryKey,
    queryFn: defaultOptions.queryFn,
  });
}

export function defineUseInfiniteQuery<TVariables extends QueryKey = QueryKey, TQueryFnData = any, TError = any, TData = TQueryFnData, TQueryData = TQueryFnData>(
  defaultOptions: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryData, TVariables>,
  keyFn: any = defaultKeyFn
) {
  function use<T = TData>(
    variables: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables, 
    options?: Partial<UseInfiniteQueryOptions<TQueryFnData, TError, T, TQueryData, TVariables>>,
    client?: QueryClient
  ) {
    
    // Create the query key using the provided keyFn function
    const queryKey = keyFn(variables);

    // Combine the defaultOptions and the options provided at runtime
    const mergedOptions = {
      ...defaultOptions,
      ...options
    } as UseInfiniteQueryOptions<TQueryFnData, TError, T, TQueryData, TVariables>;

    // @ts-ignore
    return useInfiniteQuery<TQueryFnData, TError, T, TVariables>({
      // @ts-ignore
      queryKey,
      ...mergedOptions
    }, client);
  }

  function Component<T = TData>(
    { path, body, variables, hasLoading, loading, render, children, client, ...options }:
    { path?: TVariableFn<TVariables[0]> | TVariables[0], body?: TVariableFn<TVariables[1]> | TVariables[1], variables?: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables, hasLoading?: boolean, loading?: ReactNode, render?: (data: T, results: UseInfiniteQueryResult<T, TError>) => ReactNode, children?: (data: T, results: UseInfiniteQueryResult<T, TError>) => ReactNode } & { client?: QueryClient, } & Partial<UseInfiniteQueryOptions<TQueryFnData, TError, T, TQueryData, TVariables>>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    // organize the variables into an array and fix type mismatches caused by path and body props
    const _variables = [path, body, ...(Array.isArray(variables) ? variables : [variables])].filter(Boolean) as TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables;

    const results = use(_variables, { ...(detectReactQueryVersion() === 5 ? { throwOnError: true } : { useErrorBoundary: true }), ...options }, client);

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;

    const status = results.status as QueryStatusWithPending;

    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }

    return render ? render(results.data as T, results) : children ? children(results.data as T, results) : null;
  }

  return Object.assign(Component, {
    use, 
    useKeyFn: keyFn,
    keyFn,
    defaultQuerKey: defaultOptions.queryKey,
    queryFn: defaultOptions.queryFn,
  });
}
