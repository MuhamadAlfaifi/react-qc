import { TExtMiddleware, TResolvedExt } from '.';
import { useQcDefaults } from './qc-provider';

export function useExtensions(
  __use: TExtMiddleware | undefined
): TResolvedExt {
  const { extensions } = useQcDefaults();
  const params = (extensions?.useParams as () => any)?.();
  const searchParams = (extensions?.useSearchParams as () => any)?.()?.[0];

  if (typeof __use === 'function') {
    return __use({ params, searchParams: Array.from(searchParams) });
  }

  return {
    searchParams: [],
    params: {},
  };
}
