import { createQueryComponent } from 'react-qc';

export const Get = createQueryComponent({
  keyFn: (url: string) => url,
  queryFn: async (url: string) => {
    const res = await fetch(url);
    return res.json();
  },
});