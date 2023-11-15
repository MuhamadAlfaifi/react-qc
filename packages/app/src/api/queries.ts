import { defineQueryComponent } from '../../../lib/src/define-query';
import { defineInfiniteQueryComponent } from '../../../lib/src/define-infinite-query';
import { wrap } from '../../../lib/src/wrap';
import { UseInfiniteQueryOptions, useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';

// export const Get = defineQueryComponent<{ url: TVariables['pattern'], searchParams: TVariables['searchParams'], results?: number }>({
//   queryFn: async ({ queryKey: [{ url, __use }] }: any) => {
//     const searchParams = new URLSearchParams(__use.searchParams);
//     const res = await fetch(url + '?' + searchParams.toString());
//     return res.json();
//   },
// });

// export const PaginatedGet = defineInfiniteQueryComponent<{ url: string, initialPageParam: number }>({
//   queryFn: async ({ queryKey: [{ url, initialPageParam }], pageParam }: any) => {
//     let page = pageParam ?? initialPageParam;

//     const res = await fetch(url + '?page=' + page);
//     return res.json();
//   },
//   getNextPageParam: (lastPage: any) => lastPage.info.page + 1,
// });

export const PaginatedGet = wrap(useInfiniteQuery, {
  queryFn: async ({ queryKey: [{ url, initialPageParam }], pageParam }: any) => {
    let page = pageParam ?? initialPageParam;

    const res = await fetch(url + '?page=' + page);
    return res.json();
  },
  getNextPageParam: (lastPage: any) => lastPage.info.page + 1,
});

function mySelector(data: any): string[] {
  return data.pages.map((page: any) => page.data);
}

const info = PaginatedGet.use(['/api/users', { page: 1 }], {
  select: mySelector,
});

info.data