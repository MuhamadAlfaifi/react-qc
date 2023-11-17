import { Link, useSearchParams } from 'react-router-dom';
import { InfiniteData } from '@tanstack/react-query';
import { Catch } from 'react-qc';
import { Get, MyService, Post } from '../api/queries';

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

export const pagesNames = (data: InfiniteData<TName>): TName[] => {
  return data?.pages?.flatMap((page: any) => names(page)) || [];
}

function SearchTab({ children, name = 'tab', value }: { children: React.ReactNode, name?: string, value: string }) {
  const [searchParams] = useSearchParams();
  const index = searchParams.get(name) || '0';

  return (
    <div hidden={value !== index}>
      {value === index && children}
    </div>
  );
}

function TabLink({ children, name = 'tab', value }: { children: React.ReactNode, name?: string, value: string }) {
  const [searchParams] = useSearchParams();
  const index = searchParams.get(name) || '0';

  searchParams.set(name, value);

  return (
    <Link to={`?${searchParams.toString()}`} className={`px-2 py-1 rounded-md ${value === index ? 'bg-gray-200' : 'bg-white'}`}>
      {children}
    </Link>
  );
}

export default function RootLayoutPage() {

  return (
    <div className="grid grid-cols-12 w-full max-w-4xl mx-auto py-10 gap-10">
      <nav className="col-span-3 border-r">
        <Link to="/"><h1 className="font-bold text-xl">🟠 React QC</h1></Link>
        <ul className="mt-8 list-disc space-y-2">
          <li><TabLink value="0">installation</TabLink></li>
          <li><TabLink value="1">get started</TabLink></li>
          <li><TabLink value="2">custom loading/error</TabLink></li>
          <li><TabLink value="3">custom variables</TabLink></li>
          <li><TabLink value="4">custom data function</TabLink></li>
          <li><TabLink value="5">pagination</TabLink></li>
          <li><TabLink value="6">advanced: extensions</TabLink></li>
        </ul>
      </nav>
      <main className="col-span-9">
        <SearchTab value="0">
          <h2 className="font-bold text-xl">Installation</h2>
          <pre className="language-tsx">
            <code>
              {`npm install react-qc`}
            </code>
          </pre>

          <h2 className="font-bold text-xl mt-10">requirements</h2>
          {/* @tanstack/react-query v4 or v5, and react react-dom >= v18 */}
          
          <ul>
            <li>react: v18</li>
            <li>react-dom: v18</li>
            <li>@tanstack/react-query: v4 || v5</li>
          </ul>
        </SearchTab>
        <SearchTab value="1">
          <TabLink name="subt" value="0">static</TabLink>
          <TabLink name="subt" value="1">live</TabLink>
          <SearchTab name="subt" value="0">
          <h2 className="font-bold text-xl">Define new query</h2>
          <pre className="language-tsx">
            <code>
              {`import { wrap } from 'react-qc';
import { useQuery } from '@tanstack/react-query';

export const Get = wrap(useQuery, {
  queryFn: async ({ signal }) => {
    return await fetch('https://randomuser.me/api', { signal }).then((res) => res.json());
  }
});`}
            </code>
          </pre>

          <h2 className="font-bold text-xl mt-10">Use the query</h2>
          <pre className="language-tsx">
            <code>
              {`import { Get } from 'path/to/Get';
              
// use \`Get\` as a component
function MyComponent() {
  return (
    <Get>
      {({ data }) => (
        <div>
          {JSON.stringify(data)}
        </div>
      )}
    </Get>
  );
}

// use \`Get\` as a hook
function MyComponent() {
  const { data } = Get.use();

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}`}
            </code>
          </pre>
          </SearchTab>
          <SearchTab name="subt" value="1">
            <Catch>
              <Get select={names}>
                {({ data }) => (
                  <div>
                    {JSON.stringify(data)}
                  </div>
                )}
              </Get>
            </Catch>
          </SearchTab>
        </SearchTab>
        <SearchTab value="2">
          <h2 className="font-bold text-xl">set custom loading/error</h2>
          <pre className="language-tsx">
            <code>
              {`import { Catch } from 'react-qc';
import { Get } from 'path/to/Get';
              
// use \`Get\` as a component
function MyComponent() {
  return (
    <Catch error={<div>an error occured!</div>}>
      <Get loading={'loading...'}>
        {({ data }) => (
          <div>
            {JSON.stringify(data)}
          </div>
        )}
      </Get>
    </Catch>
  );
}`}
            </code>
          </pre>

          <h2 className="font-bold text-xl mt-10">add provider for default loading/error</h2>
          <pre className="language-tsx">
            <code>
              {`import { QcProvider, Catch } from 'react-qc';
import { Get } from 'path/to/Get';

function App() {
  return (
    <QcProvider loading={'loading...'} error={<div>an error occured!</div>}>
      <MyComponent />
    </QcProvider>
  );
}

// use \`Get\` as a component with provided loading/error
function MyComponent() {
  return (
    <Catch>
      <Get>
        {({ data }) => (
          <div>
            {JSON.stringify(data)}
          </div>
        )}
      </Get>
    </Catch>
  );
}`}
            </code>
          </pre>

          <h2 className="font-bold text-xl mt-10">add retry error button</h2>
          <pre className="language-tsx">
            <code>
              {`import { Catch } from 'react-qc';
import { Get } from 'path/to/Get';

function App() {
  return (
    <QcProvider loading={'loading...'} error={({ resetErrorBoundary }) => <button onClick={resetErrorBoundary}>retry</button>}>
      <MyComponent />
    </QcProvider>
  );
}`}
            </code>
          </pre>
        </SearchTab>
        <SearchTab value="3">
          <TabLink name="subt" value="0">static</TabLink>
          <TabLink name="subt" value="1">live</TabLink>
          <SearchTab name="subt" value="0">
            <h2 className="font-bold text-xl">define custom variables</h2>
            <pre className="language-tsx">
              <code>
                {`import { wrap } from 'react-qc';
  import { useQuery } from '@tanstack/react-query';

  export const Post = wrap<[string, Record<string, any>]>(useQuery, {
    queryFn: async ({ signal, queryKey: [path, body] }) => {

      return await fetch(path, {
        method: 'post',
        body: JSON.stringify(body),
        signal
      }).then((res) => res.json());
    }
  });`}
              </code>
            </pre>

            <h2 className="font-bold text-xl mt-10">pass variables</h2>
            <pre className="language-tsx">
              <code>
                {`import { Post } from 'path/to/Post';

  // use \`Post\` as a component
  function MyComponent() {
    return (
      <Post path="https://httpbin.org/post" body={{ results: 10 }}> // or use \`variables\` prop instead of \`path\` and \`body\` for similar result
        {({ data }) => (
          <div>
            {JSON.stringify(data)}
          </div>
        )}
      </Post>
    );
  }

  // use \`Post\` as a hook
  function MyComponent() {
    const { data } = Post.use([https://httpbin.org/post', { results: 10 }]) // must be variables array prop and no path and body props

    return (
      <div>
        {JSON.stringify(data)}
      </div>
    );
  }`}
              </code>
            </pre>

            <h2 className="font-bold text-xl mt-10">optional: keyFn</h2>
            <pre className="language-tsx">
              <code>
                {`import { wrap } from 'react-qc';
import { useQuery } from '@tanstack/react-query';

  const keyFn = ([path, body]) => [path, body];

  export const Post = wrap<[string, Record<string, string>]>(useQuery, {
    queryFn: async ({ signal, queryKey: [url, search] }) => {
      ...
    },
  }, keyFn);

  the default query keyFn is: \`(variables) => variables\``}
              </code>
            </pre>
          </SearchTab>
          <SearchTab name="subt" value="1">
            <Catch>
            <Post path="https://httpbin.org/post" body={{ results: 10 }}>
              {({ data }) => (
                <div>
                  {JSON.stringify(data)}
                </div>
              )}
            </Post>
            </Catch>
          </SearchTab>
        </SearchTab>
        <SearchTab value="4">
          <h2 className="font-bold text-xl">Custom data function</h2>
          <pre className="language-tsx">
            <code>
              {`import { Get } from 'path/to/Get';

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

// pass select function prop
function MyComponent() {
  return (
    <Get variables={['https://randomuser.me/api', { results: '10' }]} select={names}>
      {({ data }) => ( // data is TName[]
        <ul>
          {data.map((name, index) => (
            <li key={index}>{name.first} {name.last}</li>
          ))}
        </ul>
      )}
    </Get>
  );
}

// pass data function parameter
function MyComponent() {
  const { data } = Get.use(['https://randomuser.me/api', { results: '10' }], { select: names }); // data is TName[]
  
  return (
    <ul>
      {data.map((name, index) => (
        <li key={index}>{name.first} {name.last}</li>
      ))}
    </ul>
  );
}`}
            </code>
          </pre>

        </SearchTab>
        <SearchTab value="5">
          <SearchTab name="subt" value="0">
            <h2 className="font-bold text-xl">Pagination</h2>
            <pre className="language-tsx">
              <code>
                {`import { wrap } from 'react-qc';
  import { useInfiniteQuery } from '@tanstack/react-query';

  export const MyService = wrap<[string, Record<string, any>]>(useInfiniteQuery, {
    queryFn: async ({ signal, queryKey: [url, parameters], pageParam = 0 }) => {
      const search = new URLSearchParams();

      for (const key in parameters) {
        search.set(key, String(parameters[key]));
      }

      search.set('page', String(pageParam));

      return await fetch(url + '?' + search.toString(), { signal }).then((res) => res.json());
    },
    getNextPageParam: (lastPage) => lastPage.info.page + 1,
  });`}
              </code>
            </pre>

            <h2 className="font-bold text-xl mt-10">use infinite query</h2>
            <pre className="language-tsx">
              <code>
                {`import { MyService } from 'path/to/MyService';

  // use \`MyService\` as a component
  function MyComponent() {
    return (
      <MyService variables={{ url: 'https://randomuser.me/api', search: { results: 10 } }}>
        {({ data, query: { fetchNextPage, hasNextPage } }) => (
          <div>
            <div>{JSON.stringify(data)}</div>
            <button onClick={fetchNextPage} disabled={!hasNextPage}>fetch next page</button>
          </div>
        )}
      </MyService>
    );
  }

  // use \`MyService\` as a hook
  function MyComponent() {
    const { data, query: { fetchNextPage, hasNextPage } }: TInfiniteQueryResults<uknown> = MyService.useInfiniteQuery({ 
      url: 'https://randomuser.me/api', 
      search: { results: 10 } 
    });

    return (
      <div>
        <div>{JSON.stringify(data)}</div>
        <button onClick={fetchNextPage} disabled={!hasNextPage}>fetch next page</button>
      </div>
    );
  }`}
              </code>
            </pre>

            <h2 className="font-bold text-xl mt-10">use infinite query with custom data function</h2>
            <pre className="language-tsx">
              <code>
                {`import { MyService } from 'path/to/MyService';

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

  export function pagesNames(pages: unknown): TName[] {
    return (pages as unknown[])?.flatMap((page) => names(page)) || [];
  }

  // pass data function prop
  function MyComponent() {
    return (
      <MyService variables={{ url: 'https://randomuser.me/api', search: { results: 10 } }} data={pagesNames}>
        {({ data, query: { fetchNextPage, hasNextPage } }) => (
          <div>
            <ul>
              {data.map((name, index) => (
                <li key={index}>{name.first} {name.last}</li>
              ))}
            </ul>
            <li><button onClick={fetchNextPage} disabled={!hasNextPage}>fetch next page</button></li>
          </div>
        )}
      </MyService>
    );
  }

  // pass data function parameter
  function MyComponent() {
    const { data, query: { fetchNextPage, hasNextPage } }: TInfiniteQueryResults<TName[]> = MyService.useInfiniteQuery({
      url: 'https://randomuser.me/api',
      search: { results: 10 }
    }, pagesNames);

    return (
      <div>
        <ul>
          {data.map((name, index) => (
            <li key={index}>{name.first} {name.last}</li>
          ))}
        </ul>
        <li><button onClick={fetchNextPage} disabled={!hasNextPage}>fetch next page</button></li>
      </div>
    );
  }`}
              </code>
            </pre>
          </SearchTab>
          <SearchTab name="subt" value="1">
            <MyService variables={['https://randomuser.me/api', { results: 10 }]} select={pagesNames}>
              {({ data, fetchNextPage, hasNextPage }) => (
                <div>
                  <div>{JSON.stringify(data)}</div>
                  <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>fetch next page</button>
                </div>
              )}
            </MyService>
          </SearchTab>
        </SearchTab>
        <SearchTab value="6">
          <h2 className="font-bold text-xl">Advanced: add extensions</h2>
          <pre className="language-tsx">
            <code>
              {`import { QcProvider } from 'react-qc';
import { useSearchParams, useParams } from 'react-router-dom';

function App() {
  return (
    <QcProvider extensions={{ useSearchParams, useParams }}>
      <MyComponent />
    </QcProvider>
  );
}`}
            </code>
          </pre>

          <h2 className="font-bold text-xl mt-10">advanced: read extensions</h2>
          <pre className="language-tsx">
            <code>
              {`import { defineQueryComponent } from 'react-qc';

export const Get = defineQueryComponent({
  queryFn: async ({ signal, queryKey: [variables] }) => {
    const search = new URLSearchParams(variables.__use.searchParams);

    const path = variables.url + '?' + search.toString();

    return await fetch(path, { signal }).then((res) => res.json());
  }
});`}
            </code>
          </pre>

          <h2 className="font-bold text-xl mt-10">advanced: use extensions</h2>
          <pre className="language-tsx">
            <code>
              {`import { Get } from 'path/to/Get';
import { searchOnly } from 'react-qc';

// use \`Get\` as a component
function MyComponent() {
  return (
    <Get variables={{ url: 'https://randomuser.me/api', __use: searchOnly(['results']) }}>
      {({ data }) => (
        <div>
          {JSON.stringify(data)}
        </div>
      )}
    </Get>
  );
}

// use \`Get\` as a hook
function MyComponent() {
  const { data }: TQueryResults<uknown> = Get.useQuery({
    url: 'https://randomuser.me/api',
    __use: searchOnly(['results'])
  });

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}`}
            </code>
          </pre>

          <h2 className="font-bold text-xl mt-10">advanced: custom extensions handler</h2>
          <pre className="language-tsx">
            <code>
              {`import { Get } from 'path/to/Get';

// custom extensions handler
function append(key, value) {
  return (extensions) => {
  const searchParams = new URLSearchParams(extensions.searchParams);

  searchParams.append(key, value);

  return {
    searchParams: Array.from(searchParams),
    params: extensions.params,
  };
}

// use \`Get\` as a component
function MyComponent() {
  return (
    <Get variables={{ url: 'https://randomuser.me/api', __use: append('example', 'value') }}>
      {({ data }) => (
        <div>
          {JSON.stringify(data)}
        </div>
      )}
    </Get>
  );
}`}
            </code>
          </pre>
        </SearchTab>
      </main>
    </div>
  );
}