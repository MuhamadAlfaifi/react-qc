import { defineUseQuery, defineUseInfiniteQuery } from 'react-qc5';
import { InfiniteData } from '@tanstack/react-query';

export const Get = defineUseQuery<[string, number]>({
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
});
const lol = <Get path="" select={(d): string[] => ['']}>
  {(data, { status }) => <div>{data}-{status}</div>}
</Get>
const { data } = Get.use([() => '', () => 4], { select: (data) => data });




const MyResource = defineUseInfiniteQuery<[string, Record<string, number>]>({
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
  initialPageParam: 0,
});

const { data: lmao } = MyResource.use(['https://randomuser.me/api', {}], { select: (data: InfiniteData<TData>) => data.pages[0].results[0].name });

<MyResource path="">
  {(data, { status, hasNextPage }) => <div>{data}-{status}</div>}
</MyResource>;











































































// export const Post = defineUseQuery({
//   queryFn: async ({ signal, queryKey: [path, body] }) => {

//     return await fetch(path as string, {
//       method: 'post',
//       body: JSON.stringify(body),
//       signal
//     }).then((res) => res.json());
//   }
// });

export const Resource = defineUseInfiniteQuery<[string, Record<string, number>]>({
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
  initialPageParam: 0,
});

type TData = {
  results: {
    name: {
      first: string;
    };
  }[];
};

const { data } = Resource.use(['https://rickandmortyapi.com/api/character', {}], { select: (data: InfiniteData<TData>) => data.pages[0].results[0].name });

// export const MyQuery = wrapWithExtensions(useQuery, {
//   queryFn: async ({ signal, queryKey: [path, body] }) => {
//     if (!body) {
//       return await fetch(path as string, { signal }).then((res) => res.json());
//     }

//     return await fetch(path as string, {
//       method: 'post',
//       body: JSON.stringify(body),
//       signal
//     }).then((res) => res.json());
//   }
// }, routerKeyFn);