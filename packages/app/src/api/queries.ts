import { defineQueryComponent } from 'react-qc';
import { names } from '../pages/home';

export const Get = defineQueryComponent<{ url: string }, ReturnType<typeof names>>({
  queryFn: async ({ queryKey: [{ url }] }: any) => {
    const res = await fetch(url);
    return res.json();
  },
  select: (data) => names(data),
});