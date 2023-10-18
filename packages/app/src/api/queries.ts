import { defineQueryComponent } from 'react-qc';

export const Get = defineQueryComponent({
  keyFn: ({ url }: any) => [url],
  queryFn: async ({ queryKey: [url] }: any) => {
    const res = await fetch(url);
    return res.json();
  },
});