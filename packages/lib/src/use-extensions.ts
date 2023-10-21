import { useQcDefaults } from './qc-provider';

export function useExtensions<T, U>(
  __use?: T
): U {
  const { extensions } = useQcDefaults();
  const params = (extensions?.useParams as () => any)?.();
  const searchParams = (extensions?.useSearchParams as () => any)?.()?.[0];

  if (typeof __use === 'function') {
    return __use({ params, searchParams }) as U;
  }

  if (Array.isArray(__use)) {
    return __use.reduce((acc, method) => {
      if (method === 'useParams') {
        acc['params'] = params;
      } else if (method === 'useSearchParams') {
        acc['searchParams'] = Array.from(searchParams || []);
      }

      return acc;
    }, {} as U);
  }

  return {} as U;
}
