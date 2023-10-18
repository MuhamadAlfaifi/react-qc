import { useQuery } from '@tanstack/react-query';
import { Get } from '../api/queries';

type TSelect<T> = T extends (...args: any[]) => infer R ? R : unknown;

type TName = {
  title: string;
  first: string;
  last: string;
};

type TItem = {
  name: TName;
}

function names(data: { results: TItem[] }): TName[] {
  return data?.results?.map((item) => item.name) || [];
}

export default function HomePage() {
  const query = useQuery({
    queryKey: ['names'],
    queryFn: () => fetch('https://randomuser.me/api/?results=10').then((res) => res.json()),
    select: names,
  });

  return (
    <div>
      <p>
        This page is rendered by the <code>Home</code> component.
        {query.data && query.data.map((name, index) => (
          <div key={index}>{name.first} {name.last}</div>
        ))}
        <Get url="https://randomuser.me/api/?results=10" select={names} render={(data: TSelect<typeof names>) => 
          <ul>
            {data.map((name, index) => (
              <li key={index}>{name.first} {name.last}</li>
            ))}
          </ul>
        } />
      </p>
    </div>
  );
}