import { UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';
import { useDefaultLoadingError } from './default-loading-error-provider';
import { QueryStatusWithPending } from './types';
import { useMemo } from 'react';

export function defineInfiniteQueryComponent({ keyFn, queryFn, ...defaultOptions }: any) {
  function useBaseInfiniteQuery({ select, ...options }: any) {
    const query = useInfiniteQuery({
      queryKey: keyFn({ ...defaultOptions, ...options }),
      queryFn,
      ...defaultOptions,
      ...options,
    });

    const pages = query.data?.pages || [];

    const data: unknown[] = useMemo(() => {
      if (pages.length === 0 || !select) {
        return pages;
      }

      return select(pages);
    }, [pages.length]);

    return { data, query };
  }

  function Component({ hasLoading, loading, ...props }: any) {
    const { loading: defaultLoading } = useDefaultLoadingError();
    const { data, query }: { data: unknown[], query: UseInfiniteQueryResult } = useBaseInfiniteQuery({ throwOnError: true, ...props });

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = props.loading || defaultLoading;
    
    const status = query.status as QueryStatusWithPending;
    
    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }

    return props.render({ data, query });
  }

  return Object.assign(Component, { useInfiniteQuery: useBaseInfiniteQuery, keyFn: (options: any) => keyFn({ ...defaultOptions, ...options }), queryFn });
}