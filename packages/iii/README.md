# Welcome to react-qc 👋

Lightweight @tanstack/react-query wrapper that provides error/loading, and more...

[![Version](https://img.shields.io/npm/v/react-qc.svg)](https://www.npmjs.com/package/react-qc)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](#table-of-contents)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/MuhamadAlfaifi/react-qc/graphs/commit-activity)

```javascript
type TName = { title: string, first: string, last: string }

const names = (data): TName[] => data?.results?.map((item) => item.name) || [];

// regualr usage
const info = Get.use(['/api/users/search', { ...searchFilters }], { select: names });

// regular usage with loading/error elements
<Catch error={<p>an error occured!</p>}>
  <Post path="/api/users/search" body={{ ...searchFilters }} loading={<p>loading...</p>} select={names}>
    {(data) => (
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
- abstracts query key creation
- optional keyFn for custom query key creation
- optional path, body syntax for variables[0] and variables[1]
- similar usage like normal hooks e.g. `Get.use([...etc])` in addition to `<Get variables={[...etc]}>...</Get>`
- ui support error/loading elements via error/loading props


# Table of Contents

- [Installation for @tanstack/react-query v5](#installation-for-tanstackreact-query-v5)
- [Installation for @tanstack/react-query v4](#installation-for-tanstackreact-query-v4)
- [Installation for react-query v3](#installation-for-react-query-v3)
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
- [Advanced: use extensions with default keyFn](#advanced-use-extensions-with-default-keyfn)
- [Advanced: use extensions with custom keyFn](#advanced-use-extensions-with-custom-keyfn)


# Installation for @tanstack/react-query v5

```bash
npm install react-qc-v
```

# Installation for @tanstack/react-query v4

```bash
npm install react-qc-iv
```

# Installation for react-query v3

```bash
npm install react-qc-iii
```

### Requirements

- react: ^16.8.0 || ^17 || ^18
- react-dom: ^16.8.0 || ^17 || ^18
- @tanstack/react-query: v3 || v4 || v5

# Define new query

```tsx
import { wrapUseQuery } from 'react-qc-iv';

export const Get = wrapUseQuery({
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
      {(data) => (
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
import { Catch } from 'react-qc-iv';
import { Get } from 'path/to/Get';

// use `Get` as a component
function MyComponent() {
  return (
    <Catch error={<div>an error occured!</div>}>
      <Get loading={'loading...'}>
        {(data) => (
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
import { QcProvider, Catch } from 'react-qc-iv';
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
        {(data) => (
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
import { Catch } from 'react-qc-iv';
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
import { wrapUseQuery } from 'react-qc-iv';
import { useQuery } from '@tanstack/react-query';

export const Post = wrapUseQuery<[string, Record<string, any>]>({
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
    <Post variables={['https://httpbin.org/post', { echo: 'body' }]}> // typescript will infer variables from generic parameter
      {(data) => (
        <div>
          {JSON.stringify(data)}
        </div>
      )}
    </Post>
  );
}

// use `Post` as a hook
function MyComponent() {
  const { data } = Post.use(['https://httpbin.org/post', { echo: 'body' }]); // typescript will infer variables from generic parameter

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
```

Note: you can take variables[0] and put it in path prop and variables[1] and put it in body prop like `<Post path={'https://httpbin.org/post'} body={{ echo: 'body' }}>...</Post>`


Note: you can also accept more variables there is no limit to the array variables

# Optional: keyFn

```tsx
import { wrapUseQuery } from 'react-qc-iv';
import type { QueryKey } from '@tanstack/react-query';

type TKeyFn = (variables: unknown[], extensions?: Record<string, any>) => QueryKey;

const keyFn: TKeyFn = (variables, extensions = {}) => [{ url: variables[0], search: variables[1] }];

export const Post = wrapUseQuery<[string, Record<string, any>]>({
  queryFn: async ({ signal, queryKey: [{ url, search }] }) => {
    ...
  },
}, keyFn);

// if you do not have a customized keyFn we will use `(variables, extensions) => variables`
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
    <Get path="https://randomuser.me/api" variables={{ results: '10' }} select={names}>
      {(data, query) => ( // data is TName[] and query.data is TName[] | undefined
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
  const { data } = Get.use(['https://randomuser.me/api', { results: '10' }], { select: names }); // data is TName[] | undefined
  
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
import { wrapUseInfiniteQuery } from 'react-qc-iv';

export const Resource = wrapUseInfiniteQuery<[string, Record<string, any>]>({
  queryFn: async ({ signal, queryKey: [url, parameters], pageParam, meta: { initialPageParam = 0 } = {} }) => {
    const search = new URLSearchParams();

    for (const key in parameters) {
      search.set(key, String(parameters[key]));
    }

    const page = typeof pageParam === 'number' ? pageParam : initialPageParam;

    search.set('page', page);

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
    <Resource path="https://randomuser.me/api" variables={{ results: 10 }}>
      {(data, { fetchNextPage, hasNextPage }) => (
        <div>
          <div>{JSON.stringify(data)}</div>
          <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>fetch next page</button>
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
    <Resource path="https://randomuser.me/api" variables={{ results: 10 }} select={pagesNames}>
      {(data, { fetchNextPage, hasNextPage }) => (
        <div>
          <ul>
            {data.map((name, index) => 
              <li key={index}>{name.first} {name.last}</li>
            )}
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
import { QcExtensionsProvider } from 'react-qc-iv';
import { useSearchParams, useParams } from 'react-router-dom';

function useExtensions() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  return { params, searchParams };
}

function App() {
  const extensions = useExtensions();
  return (
    <QcExtensionsProvider extensions={extensions}> // Alternatively, pass hook directly like extensions={useExtensions} for similar result
      <MyComponent />
    </QcExtensionsProvider>
  );
}
```


# Advanced: use extensions with default keyFn

```tsx
import { s } from 'react-qc-iv';

// pass a callback function as the first variable and it will be called with extensions to create that specific variable
<Post variables={[(extensions) => `/path/${extensions.searchParams.get('id')}`, { ...stuff  }]} ...>...</Post>

// for building the path from react router extensions.searchParams.get('id') you can use `s`` template literal tag instead
<Post path={s`/path/${'id'}`} body={{ ...stuff  }} ...>...</Post>
```

since the first variable is a callback function the default keyFn will call it for you with extensions as the first parameter


# Advanced: use extensions with custom keyFn

```tsx
import { wrapUseQuery } from 'react-qc-iv';
import type { QueryKey } from '@tanstack/react-query';

type TKeyFn = (variables: unknown[], extensions: { searchParams: URLSearchParams, params: Record<string, any> }) => QueryKey;

const customKeyFn: TKeyFn = (variables, extensions) => {
  const [path, body] = variables;
  const { params, searchParams } = extensions;

  return [path, body, params, searchParams];
}

export const Post = wrapUseQuery<[string, Record<string, string>]>({
  queryFn: async ({ signal, queryKey: [url, body, params, searchParams] }) => {
    ...
  },
}, customKeyFn);
```