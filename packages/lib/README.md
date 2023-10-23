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
- [Advanced: read extensions](#advanced-read-extensions)
- [Advanced: use extensions](#advanced-use-extensions)
- [Advanced: custom extensions handler](#advanced-custom-extensions-handler)


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
import { defineQueryComponent } from 'react-qc';

export const Get = defineQueryComponent({
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
  const { data }: TQueryResults<uknown> = Get.useQuery();

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
import { defineQueryComponent } from 'react-qc';

export const Get = defineQueryComponent<{ url: string, search: Record<string, unknown> }>({
  queryFn: async ({ signal, queryKey: [variables] }) => {
    const search = new URLSearchParams();

    for (const key in variables.search) {
      search.set(key, String(variables.search[key]));
    }

    const path = variables.url + '?' + search.toString();

    return await fetch(path, { signal }).then((res) => res.json());
  }
});
```

# Pass variables

```tsx
import { Get } from 'path/to/Get';

// use `Get` as a component
function MyComponent() {
  return (
    <Get variables={{ url: 'https://randomuser.me/api', search: { results: 10 } }}>
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
  const { data }: TQueryResults<uknown> = Get.useQuery({ 
    url: 'https://randomuser.me/api', 
    search: { results: 10 } 
  });

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
```

# Optional: keyFn

```tsx
import { defineQueryComponent } from 'react-qc';

const keyFn = (variables) => [variables.url, variables.search];

export const Get = defineQueryComponent<{ url: string, search: Record<string, unknown> }>({
  queryFn: async ({ signal, queryKey: [url, search] }) => {
    ...
  },
}, keyFn);

// the default query keyFn is: `(variables) => [variables]`
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

// pass data function prop
function MyComponent() {
  return (
    <Get variables={{ url: 'https://randomuser.me/api', search: { results: 10 } }} data={names}>
      {({ data }) => (
        <div>
          {JSON.stringify(data)}
        </div>
      )}
    </Get>
  );
}

// pass data function parameter
function MyComponent() {
  const { data }: TQueryResults<TName[]> = Get.useQuery({ 
    url: 'https://randomuser.me/api', 
    search: { results: 10 } 
  }, names);
  
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}
```

# Pagination

```tsx
import { defineInfiniteQuery } from 'react-qc';

export const PaginatedGet = defineInfiniteQuery<{ url: string, search: Record<string, unknown> }>({
  queryFn: async ({ signal, queryKey: [variables], pageParam = 0 }) => {
    const search = new URLSearchParams();

    for (const key in variables.search) {
      search.set(key, String(variables.search[key]));
    }

    search.set('page', String(pageParam));

    const path = variables.url + '?' + search.toString();

    return await fetch(path, { signal }).then((res) => res.json());
  },
  getNextPageParam: (lastPage) => lastPage.info.page + 1,
});
```

# Use infinite query

```tsx
import { PaginatedGet } from 'path/to/PaginatedGet';

// use `PaginatedGet` as a component
function MyComponent() {
  return (
    <PaginatedGet variables={{ url: 'https://randomuser.me/api', search: { results: 10 } }}>
      {({ data, query: { fetchNextPage, hasNextPage } }) => (
        <div>
          <div>{JSON.stringify(data)}</div>
          <button onClick={fetchNextPage} disabled={!hasNextPage}>fetch next page</button>
        </div>
      )}
    </PaginatedGet>
  );
}

// use `PaginatedGet` as a hook
function MyComponent() {
  const { data, query: { fetchNextPage, hasNextPage } }: TInfiniteQueryResults<uknown> = PaginatedGet.useInfiniteQuery({ 
    url: 'https://randomuser.me/api', 
    search: { results: 10 } 
  });

  return (
    <div>
      <div>{JSON.stringify(data)}</div>
      <button onClick={fetchNextPage} disabled={!hasNextPage}>fetch next page</button>
    </div>
  );
}
```

# Use infinite query with custom data function

```tsx
import { PaginatedGet } from 'path/to/PaginatedGet';

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
    <PaginatedGet variables={{ url: 'https://randomuser.me/api', search: { results: 10 } }} data={pagesNames}>
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
    </PaginatedGet>
  );
}

// pass data function parameter
function MyComponent() {
  const { data, query: { fetchNextPage, hasNextPage } }: TInfiniteQueryResults<TName[]> = PaginatedGet.useInfiniteQuery({
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
}
```

# Advanced: add extensions

```tsx
import { QcProvider } from 'react-qc';
import { useSearchParams, useParams, BrowserRouterProvider } from 'react-router-dom';

function QcProviderWithExtensions({ children }) {
  const params = useParams();
  const [searchParams] = useSearchParams();

  return (
    <QcProvider extensions={{ params, searchParams }}>
      {children}
    </QcProvider>
  );
}

function App() {
  return (
    <BrowserRouterProvider>
      <QcProviderWithExtensions>
        <MyComponent />
      </QcProviderWithExtensions>
    </BrowserRouterProvider>
  );
}
```

# Advanced: pass variables that can process the extensions before creating the query key

```tsx
import { Get } from 'path/to/Get';
import { all } from 'react-qc';

// use `all` to create a callback that filters specific parameters from searchParams
function MyComponent() {
  return (
    <Get variables={{ url: 'https://randomuser.me/api', myFn: all(['results']) }}>
      {({ data }) => (
        <div>
          {JSON.stringify(data)}
        </div>
      )}
    </Get>
  );
}
```

# Advanced (middleware pattern): pass custom keyFn and process extensions and variables before creating the query key

```tsx
import { defineQueryComponent } from 'react-qc';

const myKeyFn = ({ myFn, ...variables }, extensions) => {
  const results = myFn(extensions);
  
  const variablesWithExtensionsResults = { extResults: results, ...variables };

  return [variablesWithExtensionsResults];
};

export const Get = defineQueryComponent({
  queryFn: async ({ signal, queryKey: [variables] }) => {
    const search = new URLSearchParams(variables.extResults.searchParams);

    const path = variables.url + '?' + search.toString();

    return await fetch(path, { signal }).then((res) => res.json());
  }
}, myKeyFn);
```