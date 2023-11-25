import { QueryClient, QueryKey, UseInfiniteQueryOptions, UseInfiniteQueryResult, UseQueryOptions, UseQueryResult, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { TVariableFn } from 'common';
import { ReactNode } from 'react';
import { defaultKeyFn, useQcExtensions, useQcDefaults } from 'common';

export function defineUseQueryWithExtensions<TVariables extends QueryKey = QueryKey, TQueryFnData = any, TError = any, TData = TQueryFnData>(
  defaultOptions: UseQueryOptions<TQueryFnData, TError, TData, TVariables>,
  keyFn: any = defaultKeyFn
) {

  function useKeyFn(variables: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables) {
    const { extensions, useExtensions } = useQcExtensions();

    return keyFn(variables, useExtensions?.() || extensions);
  }

  function use<T = TData>(
    variables: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables, 
    options?: UseQueryOptions<TQueryFnData, TError, T, TVariables>, 
    client?: QueryClient
  ) {
    
    // Create the query key using the provided keyFn function
    const queryKey = useKeyFn(variables);

    // Combine the defaultOptions and the options provided at runtime
    const mergedOptions = {
      ...defaultOptions,
      ...options
    } as UseQueryOptions<TQueryFnData, TError, T, TVariables>;

    // @ts-ignore r Call the useQuery hook with the queryKey and the mergedOptions
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
  
    const results = use(_variables, { throwOnError: true, ...options }, client);
  
    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;
  
    if (finalHasLoading && results.status === 'pending') {
      return finalLoading;
    }
  
    return render ? render(results.data as T, results) : children ? children(results.data as T, results) : null;
  }
  

  return Object.assign(Component, {
    use, 
    useKeyFn,
    keyFn,
    defaultQuerKey: defaultOptions.queryKey,
    queryFn: defaultOptions.queryFn,
  });
}

export function defineUseInfiniteQueryWithExtensions<TVariables extends QueryKey = QueryKey, TQueryFnData = any, TError = any, TData = TQueryFnData>(
  defaultOptions: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TVariables>,
  keyFn: any = defaultKeyFn
) {

  function useKeyFn(variables: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables) {
    const { extensions, useExtensions } = useQcExtensions();

    return keyFn(variables, useExtensions?.() || extensions);
  }

  function use<T = TData>(
    variables: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables, 
    options?: UseInfiniteQueryOptions<TQueryFnData, TError, T, TVariables>, 
    client?: QueryClient
  ) {
    
    // Create the query key using the provided keyFn function
    const queryKey = useKeyFn(variables);

    // Combine the defaultOptions and the options provided at runtime
    const mergedOptions = {
      ...defaultOptions,
      ...options
    } as UseInfiniteQueryOptions<TQueryFnData, TError, T, TVariables>;

    // @ts-ignore Call the useQuery hook with the queryKey and the mergedOptions
    return useInfiniteQuery<TQueryFnData, TError, T, TVariables>({
      // @ts-ignore
      queryKey,
      ...mergedOptions
    }, client);
  }

  function Component<T = TData>(
    { path, body, variables, hasLoading, loading, render, children, client, ...options }:
    { path?: TVariableFn<TVariables[0]> | TVariables[0], body?: TVariableFn<TVariables[1]> | TVariables[1], variables?: TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables, hasLoading?: boolean, loading?: ReactNode, render?: (data: T, results: UseInfiniteQueryResult<T, TError>) => ReactNode, children?: (data: T, results: UseInfiniteQueryResult<T, TError>) => ReactNode } & { client?: QueryClient, } & UseInfiniteQueryOptions<TQueryFnData, TError, T, TVariables>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    // organize the variables into an array and fix type mismatches caused by path and body props
    const _variables = [path, body, ...(Array.isArray(variables) ? variables : [variables])].filter(Boolean) as TVariableFn<TVariables> | TVariableFn<TVariables>[] | TVariables;

    const results = use(_variables, { throwOnError: true, ...options }, client);

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;

    if (finalHasLoading && results.status === 'pending') {
      return finalLoading;
    }

    return render ? render(results.data as T, results) : children ? children(results.data as T, results) : null;
  }

  return Object.assign(Component, {
    use, 
    useKeyFn,
    keyFn,
    defaultQuerKey: defaultOptions.queryKey,
    queryFn: defaultOptions.queryFn,
  });
}
