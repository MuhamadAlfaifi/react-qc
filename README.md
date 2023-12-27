# Welcome to react-qc 👋

Lightweight @tanstack/react-query wrapper that makes hooks reusable, provides error/loading, and more...

[![Version](https://img.shields.io/npm/v/react-qc.svg)](https://www.npmjs.com/package/react-qc)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](#table-of-contents)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/MuhamadAlfaifi/react-qc/graphs/commit-activity)

```javascript
const Get = wrapUseQuery<[string, Record<string, any>] | [string]>({
  // no need to define queryKey now!
  queryFn: async ({ signal, queryKey: [path, search = {}] }) => {
    ...
  }
});

type TName = { 
  title: string, 
  first: string, 
  last: string,
}

type Response = { 
  results: { 
    name: TName, 
    ... 
  }[] 
}

const names = (data: Response) => data.results.map((item) => item.name);

// regular usage info.data is TName[] | undefined
const info = Get.use(['https://randomuser.me/api', { results: 10 }], { select: names });

// regular usage with loading/error elements
<Catch error={<p>an error occured!</p>}>
  <Get path="https://randomuser.me/api" variables={{ results: 10 }} loading={<p>loading...</p>} select={names}>
    {(data) => ( // data is TName[]
      <ul>
        {data.map((name, id) => 
          <li key={id}>{name.first} - {name.last}</li>
        )}
      </ul>
    )}
  </Get>
</Catch>
```


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
- [Optional: Syntactic sugar](#optional-syntactic-sugar)
- [Custom data function](#custom-data-function)
- [Pagination](#pagination)
- [Use infinite query](#use-infinite-query)
- [Use infinite query with custom data function](#use-infinite-query-with-custom-data-function)
- [Advanced: add extensions](#advanced-add-extensions)
- [Advanced: use extensions with default keyFn](#advanced-use-extensions-with-default-keyfn)
- [Advanced: use extensions with custom keyFn](#advanced-use-extensions-with-custom-keyfn)
- [Extra: default key fn](#extra-default-key-fn)
- [Extra: default error/loading apply only to first page](#extra-by-default-errorloading-apply-only-to-first-page)


# Installation for @tanstack/react-query v5

```bash
npm install react-qc-v
```

#### Requirements

- react: ^18
- react-dom: ^18
- @tanstack/react-query: v5

# Installation for @tanstack/react-query v4

```bash
npm install react-qc-iv
```

#### Requirements

- react: ^16.8.0 || ^17 || ^18
- react-dom: ^16.8.0 || ^17 || ^18
- @tanstack/react-query: v4

# Installation for react-query v3

```bash
npm install react-qc-iii
```

#### Requirements

- react: ^16.8.0 || ^17 || ^18
- react-dom: ^16.8.0 || ^17 || ^18
- react-query: v3


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
    <QcProvider loading={'loading...'} error={({ retry }) => <button onClick={retry}>retry</button>}>
      <MyComponent />
    </QcProvider>
  );
}
```

# Define custom variables

```tsx
import { wrapUseQuery } from 'react-qc-iv';
import { useQuery } from '@tanstack/react-query';

export const Get = wrapUseQuery<[string, Record<string, any> | undefined]>({
  queryFn: async ({ signal, queryKey: [path, search = {}] }) => {
    const searchParams = new URLSearchParams(Object.entries(search));

    return await fetch(path + '?' + searchParams.toString(), { signal }).then((res) => res.json());
  }
});

```

# Pass variables

```tsx
import { Get } from 'path/to/Get';

// use `Get` as a component
function MyComponent() {
  return (
    <Get variables={['https://randomuser.me/api', { results: 10 }]}> {/* variables prop type here is the generic parameter associated with Get */}
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
  const { data } = Get.use(['https://randomuser.me/api', { results: 10 }]); // variables prop type here is the generic parameter associated with Get

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
```

# Optional: Syntactic sugar

optional path prop as variables[0] and body prop as variables[1]

or

optional path prop as variables[0] and variables as variables[1]

```tsx
import { Get } from 'path/to/Get';

// use `Get` as a component
function MyComponent() {
  return (
    <Get path="https://randomuser.me/api" variables={{ results: 10 }}>
      {(data) => (
        <div>
          {JSON.stringify(data)}
        </div>
      )}
    </Get>
  );
}
```

# Custom data function

```tsx
import { Get } from 'path/to/Get';

type TName = { title: string, first: string, last: string }

type Response = {
  results: {
    name: TName
  }[]
}

const names = (data: Response) => data.results.map((item) => item.name) || [];

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

export const Paginate = wrapUseInfiniteQuery<[string, Record<string, any>]>({
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
import { Paginate } from 'path/to/Paginate';

// use `Paginate` as a component
function MyComponent() {
  return (
    <Paginate path="https://randomuser.me/api" variables={{ results: 10 }}>
      {(data, { fetchNextPage, hasNextPage }) => (
        <div>
          <div>{JSON.stringify(data)}</div>
          <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>fetch next page</button>
        </div>
      )}
    </Paginate>
  );
}

// use `Paginate` as a hook
function MyComponent() {
  const { data, fetchNextPage, hasNextPage } = Paginate.use(['https://randomuser.me/api', { results: 10 }]);

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
import { type InfiniteData } from '@tanstack/react-query';
import { Paginate } from 'path/to/Paginate';

type TName = { title: string, first: string, last: string }

type Response = {
  results: {
    name: TName
  }[]
}

const names = (data: InfiniteData<Response>) => data.pages.flatMap(page => data.results.map((item) => item.name));

// pass data function prop
function MyComponent() {
  return (
    <Paginate path="https://randomuser.me/api" variables={{ results: 10 }} select={names}>
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
    </Paginate>
  );
}

// pass data function parameter
function MyComponent() {
  const { data, fetchNextPage, hasNextPage } = Paginate.use(['https://randomuser.me/api', { results: 10 }], { select: names });

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

> 🚨  IMPORTANT  
> for extensions: You need to define 
> wrapUseQueryWithExtensions, or 
> wrapUseInfiniteQueryWithExtensions when defining your query
> ```tsx
> import { 
>  ...
>  wrapUseQueryWithExtensions,
>  wrapUseInfiniteQueryWithExtensions,
>  ...
> } from 'react-qc-iv';
> ```

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

pass a callback function in place of a variable and it will be called with extensions to create that specific variable
```tsx
<Get variables={[(extensions) => `/path/${extensions.searchParams.get('id')}`, { ...stuff  }]} ...>...</Get>
```   

for building strings using react router like extensions.searchParams.get('id'), you can use `s` template literal tag for substituting searchParams values in the string and Optionally, you can add fallback with ! for example s`/path/${'id!0'}` will fallback to 0 if id is not found in searchParams
```tsx
import { s } from 'react-qc-iv';

<Get path={s`/path/${'id!0'}`} variables={{ ...stuff  }} ...>...</Get>
```

since the first variable is a callback function the default keyFn will call it for you with extensions as the first parameter


# Advanced: use extensions with custom keyFn

```tsx
import { wrapUseQueryWithExtensions } from 'react-qc-iv';
import type { QueryKey } from '@tanstack/react-query';

type TKeyFn = (variables: unknown[], extensions: { searchParams: URLSearchParams, params: Record<string, any> }) => QueryKey;

const customKeyFn: TKeyFn = (variables, extensions) => {
  const [path, body] = variables;
  const { params, searchParams } = extensions;

  return [path, { body, params, searchParams: searchParams.toString() }];
}

export const Get = wrapUseQueryWithExtensions<[string, Record<string, any>]>({
  queryFn: async ({ signal, queryKey: [url, { body, params, searchParams }] }) => {
    ...
  },
}, customKeyFn);
```

# Extra: default key fn


You can pass callbacks that generate the queryKey and the default keyFn will call them for you with optional extensions as the first parameter

here is the imlementation of the default keyFn
```tsx
import { TVariableFn } from './types';
import { QueryKey } from '@tanstack/react-query';

export const defaultKeyFn = <T extends TVariableFn<unknown> | TVariableFn<unknown>[] | unknown[], Extensions = never>(variables: T, extensions: Extensions): QueryKey => {
  if (typeof variables === 'function') {
    return variables(extensions) as unknown as QueryKey;
  }
  
  return variables.map((variable) => {
    if (typeof variable === 'function') {
      return variable(extensions);
    }

    return variable;
  }) as unknown as QueryKey;
};
```

# Extra: by default error/loading apply only to first page

take the previous <Paginate /> example, the loading/error in case promise pending/rejected will not be shown on 2nd page and so on

if first page is already rendered and next page rejected you should handle the error manually using `isFetchingNextPage` and `error` properties

```tsx
import { Paginate } from 'path/to/Paginate';

// use `Paginate` as a component
function MyComponent() {
  return (
    <Catch error={<p>first page rejected!</p>}>
      <Paginate path="https://randomuser.me/api" loading={<p>first page spinner!</p>} variables={{ results: 10 }}>
        {(data, { fetchNextPage, hasNextPage, isFetchingNextPage, error }) => (
          <div>
            <div>{JSON.stringify(data)}</div>
            {hasNextPage 
              ? <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>{error ? 'retry' : 'fetch'} next page</button> 
              : <p>no more results.</p>}
          </div>
        )}
      </Paginate>
    </Catch>
  );
}
```

# Extra: how to pass react query options?

you can pass refetchInterval or any other react query options to the query by passing it as 2nd parameter to the hook, or directly pass refetchInterval as a prop to the component

```tsx
import { Get } from 'path/to/Get';

// use `Get` as a component
function MyComponent() {
  return (
    <Get path="https://randomuser.me/api" variables={{ results: 10 }} refetchInterval={5000}>
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
  const { data } = Get.use(['https://randomuser.me/api', { results: 10 }], { refetchInterval: 5000 });

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
```

# Extra: how to disable default error/loading behavior?

use props like these `hasLoading={false} throwOnError={false} useErrorBoundary={false}` to disable default error/loading behavior