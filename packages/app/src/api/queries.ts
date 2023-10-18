import { defineQueryComponent } from 'react-qc';

export const Get = defineQueryComponent({
  keyFn: (url: string) => url,
  queryFn: async (url: string) => {
    const res = await fetch(url);
    return res.json();
  },
});