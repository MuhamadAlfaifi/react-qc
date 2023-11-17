import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { defaultKeyFn, wrap } from '../../../lib/src/index';
import { routerKeyFn, wrapWithExtensions } from 'react-qc';

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

export const Resource = wrap(useInfiniteQuery, {
  queryFn: async ({ signal, queryKey: [base, parameters], pageParam = 0 }) => {
    const search = new URLSearchParams();
    const _parameters = parameters as Record<string, any>;

    for (const key in _parameters) {
      search.set(key, String(_parameters[key]));
    }

    search.set('page', String(pageParam));

    return await fetch(base + '?' + search.toString(), { signal }).then((res) => res.json());
  },
  getNextPageParam: (lastPage: any) => lastPage.info.page + 1,
});

export const MyQuery = wrapWithExtensions(useQuery, {
  queryFn: async ({ signal, queryKey: [path, body] }) => {
    if (!body) {
      return await fetch(path as string, { signal }).then((res) => res.json());
    }

    return await fetch(path as string, {
      method: 'post',
      body: JSON.stringify(body),
      signal
    }).then((res) => res.json());
  }
}, routerKeyFn);