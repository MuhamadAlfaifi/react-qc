import { useQcDefaults } from './qc-provider';

export function useExtensions(names: string[] = []) {
  const { extensions } = useQcDefaults();
  const params = (extensions?.useParams as () => any)?.();
  const searchParams = (extensions?.useSearchParams as () => any)?.()[0]?.toString();

  const __extensions = names.map(i => {
    if (i === 'useParams') {
      return params;
    }
    if (i === 'useSearchParams') {
      return searchParams;
    }
    return i;
  });

  return __extensions;
}