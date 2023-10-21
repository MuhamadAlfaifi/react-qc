import { defineQueryComponent, defineInfiniteQueryComponent } from 'react-qc';

export const Get = defineQueryComponent<{ url: string }>({
  queryFn: async ({ queryKey: [{ url }] }: any) => {
    const res = await fetch(url);
    return res.json();
  },
});

export const PaginatedGet = defineInfiniteQueryComponent<{ url: string, initialPageParam: number }>({
  queryFn: async ({ queryKey: [{ url, initialPageParam }], pageParam }: any) => {
    let page = pageParam ?? initialPageParam;

    const res = await fetch(url + '?page=' + page);
    return res.json();
  },
  getNextPageParam: (lastPage: any) => lastPage.info.page + 1,
});