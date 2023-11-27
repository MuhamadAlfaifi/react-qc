import { QueryKey, UseInfiniteQueryOptions, UseInfiniteQueryResult, UseQueryOptions, UseQueryResult, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { defaultKeyFn, useQcDefaults } from 'common';
import type { Body, ExcludeFirst, ExcludeFirstTwo, LoadingProps, Path, RenderProps, Variables } from 'common';

export function wrapUseQuery<TVariables extends QueryKey = QueryKey, TQueryFnData = any, TError = any, TData = TQueryFnData>(
  defaultOptions: Omit<UseQueryOptions<TQueryFnData, TError, TData, TVariables>, 'queryKey'> | UseQueryOptions<TQueryFnData, TError, TData, TVariables>,
  keyFn: any = defaultKeyFn
) {
  function use<T = TData>(
    variables: Variables<TVariables>,
    options?: Omit<UseQueryOptions<TQueryFnData, TError, T, TVariables>, 'queryKey'>,
  ) {
    
    /**
     * Create the query key using user provided keyFn function
     */
    const queryKey = keyFn(variables);

    /**
     * Combine the defaultOptions and the options provided at runtime
     */
    const mergedOptions = {
      queryKey,
      ...defaultOptions,
      ...options
    } as UseQueryOptions<TQueryFnData, TError, T, TVariables>;

    /**
     * use the react-query hook
     */
    return useQuery<TQueryFnData, TError, T, TVariables>(mergedOptions);
  }

  type CommonProps<T> = LoadingProps & RenderProps<T, UseQueryResult<T, TError>> & Omit<UseQueryOptions<TQueryFnData, TError, T, TVariables>, 'queryKey'>;
  
  function Component<T = TData>(props:
    { path: Path<TVariables>, body: Body<TVariables>, variables?: Variables<ExcludeFirstTwo<TVariables>> } & CommonProps<T>
  ): any;
  function Component<T = TData>(props:
    { path: Path<TVariables>, variables?: Variables<ExcludeFirst<TVariables>> } & CommonProps<T>
  ): any;
  function Component<T = TData>(props:
    { variables?: Variables<TVariables> } & CommonProps<T>
  ): any;

  function Component<T = TData>(
    { path, body, variables, hasLoading, loading, render, children, ...options }:
    { path?: any, body?: any, variables?: any } & CommonProps<T>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    /**
     * normalize the variables from (props: path/body/variables) for Component.use()
     */
    const _variables = [path, body, ...(Array.isArray(variables) ? variables : [variables])].filter(Boolean) as Variables<TVariables>;
  
    /**
     * fetch data and throw to nearest error boundary if queryFn fails
     */
    const results = use(_variables, { useErrorBoundary: true, ...options });
  
    /**
     * if data is pending render the loading component
     */
    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;

    if (finalHasLoading && results.status === 'loading') {
      return finalLoading;
    }
  
    /**
     * start rendering with data
     */
    return render ? render(results.data as T, results) : children ? children(results.data as T, results) : null;
  }
  

  return Object.assign(Component, {
    use, 
    useKeyFn: keyFn,
    keyFn,
    defaultOptions,
  });
}

export function wrapUseInfiniteQuery<TVariables extends QueryKey = QueryKey, TQueryFnData = any, TError = any, TData = TQueryFnData, TQueryData = TQueryFnData>(
  defaultOptions: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryData, TVariables>, 'queryKey'> | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryData, TVariables>,
  keyFn: any = defaultKeyFn
) {
  function use<T = TData>(
    variables: Variables<TVariables>,
    options?: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, T, TQueryData, TVariables>, 'queryKey' | 'getNextPageParam'>,
  ) {
    /**
     * Create the query key using user provided keyFn function
     */
    const queryKey = keyFn(variables);

    /**
     * Combine the defaultOptions and the options provided at runtime
     */
    const mergedOptions = {
      queryKey,
      ...defaultOptions,
      ...options
    } as UseInfiniteQueryOptions<TQueryFnData, TError, T, TQueryData, TVariables>;

    /**
     * use the react-query hook
     */
    // @ts-ignore
    return useInfiniteQuery<TQueryFnData, TError, T, TVariables>(mergedOptions);
  }

  type CommonProps<T> = LoadingProps & RenderProps<T, UseInfiniteQueryResult<T, TError>> & Omit<UseInfiniteQueryOptions<TQueryFnData, TError, T, TQueryData, TVariables>, 'queryKey' | 'getNextPageParam'>;

  function Component<T = TData>(props:
    { path: Path<TVariables>, body: Body<TVariables>, variables?: Variables<ExcludeFirstTwo<TVariables>> } & CommonProps<T>
  ): any;
  function Component<T = TData>(props:
    { path: Path<TVariables>, variables?: Variables<ExcludeFirst<TVariables>> } & CommonProps<T>
  ): any;
  function Component<T = TData>(props:
    { variables?: Variables<TVariables> } & CommonProps<T>
  ): any;

  function Component<T = TData>(
    { path, body, variables, hasLoading, loading, render, children, ...options }:
    { path?: any, body?: any, variables?: any } & CommonProps<T>
  ) {
    const { loading: defaultLoading } = useQcDefaults();

    /**
     * normalize the variables from (props: path/body/variables) for Component.use()
     */
    const _variables = [path, body, ...(Array.isArray(variables) ? variables : [variables])].filter(Boolean) as Variables<TVariables>;

    /**
     * fetch data and throw to nearest error boundary if queryFn fails
     */
    const results = use(_variables, { useErrorBoundary: true, ...options });

    /**
     * if data is pending render the loading component
     */
    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;

    if (finalHasLoading && results.status === 'loading') {
      return finalLoading;
    }

    /**
     * start rendering with data
     */
    return render ? render(results.data as T, results) : children ? children(results.data as T, results) : null;
  }
  
  return Object.assign(Component, {
    use, 
    useKeyFn: keyFn,
    keyFn,
    defaultOptions,
  });
}