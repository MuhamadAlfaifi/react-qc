import { defineQueryComponent } from 'react-qc';

export const Get = defineQueryComponent(
  (variables: { url: string; }) => [variables.url], {
  queryFn: async ({ queryKey: [url] }: any) => {
    const res = await fetch(url);
    return res.json();
  },
});