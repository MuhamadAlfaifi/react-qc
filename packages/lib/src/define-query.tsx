import { useQuery } from '@tanstack/react-query';
import { useDefaultLoadingError } from '~/default-loading-error-provider';
import { QueryStatusWithPending } from '~/types';

export function defineQueryComponent({ keyFn, queryFn, ...defaultOptions }: any) {
  function useBaseQuery({ select, ...options }: any) {
    const query = useQuery({
      queryKey: keyFn({ ...defaultOptions, ...options }),
      queryFn,
      select: (data: any) => {
        if (select) {
          return select(data);
        }

        return data;
      },
      ...defaultOptions,
      ...options,
    });

    const data = query.data;

    return { data, query };
  }

  function Component({ hasLoading, loading, ...props }: any) {
    const { loading: defaultLoading } = useDefaultLoadingError();
    const { data, query } = useBaseQuery({ throwOnError: true, ...props });

    const finalHasLoading = typeof hasLoading === 'boolean' ? hasLoading : true;
    const finalLoading = props.loading || defaultLoading;
    
    const status = query.status as QueryStatusWithPending;
    
    if (finalHasLoading && (status === 'loading' || status === 'pending')) {
      return finalLoading;
    }

    return props.render(data, query);
  }

  return Object.assign(Component, { useQuery: useBaseQuery });
}