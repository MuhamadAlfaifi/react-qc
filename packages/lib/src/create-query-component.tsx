import { useQuery } from '@tanstack/react-query';
import { useDefaultLoadingError } from '~/default-loading-error-provider';

type TData<T> = T extends (...args: any[]) => infer R ? R : unknown;

export function createQueryComponent({ keyFn, queryFn, ...defaultOptions }: any) {
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

  function Component(props: any) {
    const { loading: defaultLoading } = useDefaultLoadingError();
    const { data, query } = useBaseQuery(props);
    
    const hasLoading = 'hasLoading' in props ? props.hasLoading : true;
    const loading = props.loading || defaultLoading;

    if (hasLoading && query.isLoading) {
      return loading;
    }

    return props.render(data as TData<typeof props.select>, query);
  }

  return Object.assign(Component, { useQuery: useBaseQuery });
}