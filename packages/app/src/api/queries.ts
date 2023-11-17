import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { defaultKeyFn, wrap } from '../../../lib/src/index';

export const Get = wrap(useQuery, {
  queryFn: async ({ signal }) => {
    return await fetch('https://randomuser.me/api', { signal }).then((res) => res.json());
  },
}, defaultKeyFn);

export const Post = wrap(useQuery, {
  queryFn: async ({ signal, queryKey: [path, body] }) => {

    return await fetch(path as string, {
      method: 'post',
      body: JSON.stringify(body),
      signal
    }).then((res) => res.json());
  }
});

export const MyService = wrap(useInfiniteQuery, {
  queryFn: async ({ signal, queryKey: [url, parameters], pageParam = 0 }) => {
    const search = new URLSearchParams();
    const _parameters = parameters as Record<string, any>;

    for (const key in _parameters) {
      search.set(key, String(_parameters[key]));
    }

    search.set('page', String(pageParam));

    return await fetch(url + '?' + search.toString(), { signal }).then((res) => res.json());
  },
  getNextPageParam: (lastPage: any) => lastPage.info.page + 1,
});

export const PaginatedGet = wrap(useInfiniteQuery, {
  queryFn: async ({ signal, pageParam }) => {
    return await fetch(`https://randomuser.me/api?page=${pageParam}`, { signal }).then((res) => res.json());
  },
  getNextPageParam: (_, pages) => pages.length + 1,
}, defaultKeyFn);