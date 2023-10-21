import { useSearchParams } from 'react-router-dom';
import { Get, PaginatedGet } from '../api/queries';
import { Catch } from 'react-qc';

type TName = {
  title: string;
  first: string;
  last: string;
};

type TItem = {
  name: TName;
}

export function names(data: unknown): TName[] {
  return (data as { results: TItem[] })?.results?.map((item) => item.name) || [];
}

export function name(data: unknown): TName {
  return (data as { results: TItem[] })?.results?.[0]?.name || { title: '', first: '', last: '' };
}

export function pagesNames(pages: unknown[]): TName[] {
  return (pages as unknown[])?.flatMap((page) => names(page)) || [];
}

export default function HomePage() {
  const [searchParams] = useSearchParams();

  return (
    <div>
      <p>
        This page is rendered by the <code>Home</code> component.
        <Catch>
          <Get variables={{ url: 'https://randomuser.me/api/?results=10', }} data={names} render={({ data }) => 
            <ul>
              {data.map((name, index) => (
                <li key={index}>{name.first} {name.last}</li>
              ))}
            </ul>
          } />
        </Catch>
        <Catch>
          <PaginatedGet variables={{ url: 'https://randomuser.me/api/?results=10', initialPageParam: 0 }} data={pagesNames} render={({ data, query }) => 
            <ul>
              {data.map((name, index) => (
                <li key={index}>{name.first} {name.last}</li>
              ))}
              <li><button onClick={() => query.fetchNextPage()}>fetch</button></li>
            </ul>
          } />
        </Catch>
      </p>
    </div>
  );
}