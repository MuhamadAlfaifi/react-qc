import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useDefaultLoadingError } from './default-loading-error-provider';
import { QueryStatusWithPending, TKeyFn, TQueryResults, TRenderResults, TSelect } from './types';
import { defaultSelect } from './utils';
import { ReactNode } from 'react';

export function defineQueryComponent<TVariables>(keyFn: TKeyFn<TVariables>, defaultOptions: UseQueryOptions) {

  function useBaseQuery<T = unknown>(variables: TVariables, select: TSelect<T> = defaultSelect<T>, options?: UseQueryOptions): TQueryResults<T> {
    const query = useQuery({
      queryKey: keyFn(variables),
      select: (data: unknown) => {
        if (select) {
          return select(data);
        }

        return data;
      },
      ...defaultOptions,
      ...options,
    });

    const data = query.data as T;

    return { data, query };
  }

  function Component<T = unknown>(
    { variables = ({} as TVariables), select = defaultSelect<T>, hasLoading, loading, render, children, ...props }: 
    { variables: TVariables, select: TSelect<T>, hasLoading?: boolean, loading?: ReactNode, render?: TRenderResults<T>, children?: TRenderResults<T> } & UseQueryOptions<T>
  ) {
    const { loading: defaultLoading } = useDefaultLoadingError();
    const { data, query }: TQueryResults<T> = useBaseQuery(variables, select, { throwOnError: true, ...props } as UseQueryOptions);

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = loading || defaultLoading;
    
    const status = query.status as QueryStatusWithPending;
    
    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }

    return render ? render({ data, query }) : children ? children({ data, query }) : null;
  }

  return Object.assign(Component, { 
    useQuery: useBaseQuery, 
    keyFn: (options: TVariables) => keyFn(options),
    queryFn: defaultOptions.queryFn,
  });
}
