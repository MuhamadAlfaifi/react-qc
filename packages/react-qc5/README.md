# Welcome to react-qc 👋

Lightweight @tanstack/react-query wrapper that provides error/loading, and more...

[![Version](https://img.shields.io/npm/v/react-qc.svg)](https://www.npmjs.com/package/react-qc)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](#table-of-contents)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/MuhamadAlfaifi/react-qc/graphs/commit-activity)

```javascript
type TName = { title: string, first: string, last: string }

const names = (data): TName[] => data?.results?.map((item) => item.name) || [];

<Catch error={<p>an error occured!</p>}>
  <Post path="/api/users/search" body={{ ...searchFilters }} loading={<p>loading...</p>} select={names}>
    {({ data }) => (
      <ul>
        {data.map(name => 
          <li key={name}>{name.first} - {name.last}</li>
        )}
      </ul>
    )}
  </Post>
</Catch>
```

## Features
- ui support for loading and error
- keyFn to customize the query key creation
- wrapped hook can be used as a component or a hook (e.g. `Get.use([...etc])` or `<Get variables={[...etc]}>...</Get>`)


# Table of Contents

- [Installation](#installation)
- [Define new query](#define-new-query)
- [Use the query](#use-the-query)
- [Set custom loading/error](#set-custom-loadingerror)
- [Add provider for default loading/error](#add-provider-for-default-loadingerror)
- [Add retry button](#add-retry-button)
- [Define custom variables](#define-custom-variables)
- [Pass variables](#pass-variables)
- [Optional: keyFn](#optional-keyfn)
- [Custom data function](#custom-data-function)
- [Pagination](#pagination)
- [Use infinite query](#use-infinite-query)
- [Use infinite query with custom data function](#use-infinite-query-with-custom-data-function)
- [Advanced: add extensions](#advanced-add-extensions)
- [Advanced: read extensions with custom keyFn](#advanced-read-extensions-with-custom-keyfn)


# Installation

```bash
npm install react-qc
```

### Requirements

- react: ^16.8.0 || ^17 || ^18
- react-dom: ^16.8.0 || ^17 || ^18
- @tanstack/react-query: v4 || v5

# Define new query

```tsx
import { wrap } from 'react-qc';
import { useQuery } from '@tanstack/react-query';

export const Get = wrap(useQuery, {
  queryKey: ['users'],
  queryFn: async ({ signal }) => {
    return await fetch('https://randomuser.me/api', { signal }).then((res) => res.json());
  }
});
```

# Use the query

```tsx
import { Get } from 'path/to/Get';

// use `Get` as a component
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

// use `Get` as a hook
function MyComponent() {
  const { data } = Get.use();

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
```

# Set custom loading/error

```tsx
import { Catch } from 'react-qc';
import { Get } from 'path/to/Get';

// use `Get` as a component
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
}
```

# Add provider for default loading/error

```tsx
import { QcProvider, Catch } from 'react-qc';
import { Get } from 'path/to/Get';

function App() {
  return (
    <QcProvider loading={'loading...'} error={<div>an error occured!</div>}>
      <MyComponent />
    </QcProvider>
  );
}

// use `Get` as a component with provided loading/error
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
}
```

# Add retry button

```tsx
import { Catch } from 'react-qc';
import { Get } from 'path/to/Get';

function App() {
  return (
    <QcProvider loading={'loading...'} error={({ resetErrorBoundary }) => <button onClick={resetErrorBoundary}>retry</button>}>
      <MyComponent />
    </QcProvider>
  );
}
```

# Define custom variables

```tsx
import { wrap } from 'react-qc';
import { useQuery } from '@tanstack/react-query';

export const Post = wrap<[string, Record<string, any>], unknown, typeof useQuery>(useQuery, {
  queryFn: async ({ signal, queryKey: [path, body] }) => {

    return await fetch(path, {
      method: 'post',
      body: JSON.stringify(body),
      signal
    }).then((res) => res.json());
  }
});

```

# Pass variables

```tsx
import { Post } from 'path/to/Post';

// use `Post` as a component
function MyComponent() {
  return (
    <Post variables={['https://httpbin.org/post', { results: 10 }]}> // typescript will infer variables from generic parameter
      {({ data }) => (
        <div>
          {JSON.stringify(data)}
        </div>
      )}
    </Post>
  );
}

// use `Post` as a hook
function MyComponent() {
  const { data } = Post.use(['https://httpbin.org/post', { results: 10 }]); // typescript will infer variables from generic parameter

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
```

Note: if your variables are like this: `<Post variables={['https://httpbin.org/post', { results: 10 }]}>...</Post>` you can also use `<Post path={'https://httpbin.org/post'} body={{ results: 10 }}>...</Post>` for similar result

# Optional: keyFn

```tsx
import { wrap } from 'react-qc';
import { useQuery } from '@tanstack/react-query';

const keyFn = (variables) => [{ url: variables[0], search: variables[1] }];

export const Post = wrap<[string, Record<string, string>], unknown, typeof useQuery>(useQuery, {
  queryFn: async ({ signal, queryKey: [{ url, search }] }) => {
    ...
  },
}, keyFn);

// the default query keyFn is: `(variables) => variables`
```

# Custom data function

```tsx
import { Get } from 'path/to/Get';

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
}
```

# Pagination

```tsx
import { wrap } from 'react-qc';
import { useInfiniteQuery } from '@tanstack/react-query';

export const Resource = wrap<[string, Record<string, any>], unknown, typeof useInfiniteQuery>(useInfiniteQuery, {
  queryFn: async ({ signal, queryKey: [url, parameters], pageParam = 0 }) => {
    const search = new URLSearchParams();

    for (const key in parameters) {
      search.set(key, String(parameters[key]));
    }

    search.set('page', String(pageParam));

    return await fetch(url + '?' + search.toString(), { signal }).then((res) => res.json());
  },
  getNextPageParam: (lastPage) => lastPage.info.page + 1,
});

```

# Use infinite query

```tsx
import { Resource } from 'path/to/Resource';

// use `Resource` as a component
function MyComponent() {
  return (
    <Resource variables={['https://randomuser.me/api', { results: 10 }]}>
      {({ data, fetchNextPage, hasNextPage }) => (
        <div>
          <div>{JSON.stringify(data)}</div>
          <button onClick={fetchNextPage} disabled={!hasNextPage}>fetch next page</button>
        </div>
      )}
    </Resource>
  );
}

// use `Resource` as a hook
function MyComponent() {
  const { data, fetchNextPage, hasNextPage } = Resource.use(['https://randomuser.me/api', { results: 10 }]);

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>fetch next page</button>
    </div>
  );
}
```

# Use infinite query with custom data function

```tsx
import { Resource } from 'path/to/Resource';

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
    <Resource variables={['https://randomuser.me/api', { results: 10 }]} select={pagesNames}>
      {({ data, fetchNextPage, hasNextPage }) => (
        <div>
          <ul>
            {data.map((name, index) => (
              <li key={index}>{name.first} {name.last}</li>
            ))}
          </ul>
          <li><button onClick={() => fetchNextPage()} disabled={!hasNextPage}>fetch next page</button></li>
        </div>
      )}
    </Resource>
  );
}

// pass data function parameter
function MyComponent() {
  const { data, fetchNextPage, hasNextPage } = Resource.use(['https://randomuser.me/api', { results: 10 }], { select: pagesNames });

  return (
    <div>
      <ul>
        {data.map((name, index) => (
          <li key={index}>{name.first} {name.last}</li>
        ))}
      </ul>
      <li><button onClick={() => fetchNextPage()} disabled={!hasNextPage}>fetch next page</button></li>
    </div>
  );
}
```

# Advanced: add extensions

```tsx
import { QcExtensionsProvider } from 'react-qc';
import { useSearchParams, useParams } from 'react-router-dom';

function useExtensions() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  return { params, searchParams };
}

function App() {
  const extensions = useExtensions();
  return (
    <QcExtensionsProvider extensions={extensions}> // Alternatively, pass hook directly like useExtensions={useExtensions} for similar result
      <MyComponent />
    </QcExtensionsProvider>
  );
}
```

note: extensions are passed to the keyFn so you need to implement a keyFn for accessing the extensions before creating the query key
note: if you need to recreate the queryKey you can use `YourQuery.useKeyFnWithExtensions([...variables])` or `YourQuery.keyFn([...variables])` for when YourQuery is wrapWithExtensions or wrapped without extensions respectively

# Advanced: read extensions with custom keyFn

```tsx
import { wrap } from 'react-qc';
import { useQuery } from '@tanstack/react-query';

function keyFn(variables, extensions) {
  const [path, body] = variables;
  const { params, searchParams } = extensions;

  return [path, body, params, searchParams];
}

export const Post = wrap<[string, Record<string, string>], unknown, typeof useQuery>(useQuery, {
  queryFn: async ({ signal, queryKey: [url, body, params, searchParams] }) => {
    ...
  },
}, keyFn);
```