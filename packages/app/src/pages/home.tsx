import { Get } from '../api/queries';
import { Catch } from 'react-qc';

type TName = {
  title: string;
  first: string;
  last: string;
};

type TItem = {
  name: TName;
}

function names(data: unknown): TName[] {
  return (data as { results: TItem[] })?.results?.map((item) => item.name) || [];
} 

export default function HomePage() {
  const { data } = Get.useQuery({
    url: 'https://randomuser.me/api/?results=10',
  }, names)

  return (
    <div>
      <p>
        This page is rendered by the <code>Home</code> component.
        <Catch>
          <Get variables={{ url: '' }} select={names} refetchInterval={48} render={({ data }) => 
            <ul>
              {data.map((name, index) => (
                <li key={index}>{name.first} {name.last}</li>
              ))}
            </ul>
          } />
        </Catch>
      </p>
    </div>
  );
}