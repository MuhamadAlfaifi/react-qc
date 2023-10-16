import { QueryClient } from '@tanstack/react-query';

const client = new QueryClient();

client.setDefaultOptions({
  queries: {
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  },
});

export { client };