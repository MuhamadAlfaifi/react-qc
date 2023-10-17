import { Get } from '../api/queries';

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

type TSelect<T> = T extends (...args: any[]) => infer R ? R : unknown;

export default function HomePage() {
  return (
    <div>
      <p>
        This page is rendered by the <code>Home</code> component.
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