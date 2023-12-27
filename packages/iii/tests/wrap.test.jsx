import { waitFor } from '@testing-library/react';
import { render } from './shared';
import { QcProvider, useQcDefaults, QcExtensionsProvider } from '../src/common/index';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { wrapUseInfiniteQuery, wrapUseInfiniteQueryWithExtensions, wrapUseQuery, wrapUseQueryWithExtensions } from '../src/wrap';

it('does not fail when creating query component', () => {
  const queryFn = () => Promise.resolve(10);

  wrapUseQuery({ queryFn });
  
  const keyFn = ({ myProp = 'my-key', myProps = { value1: 'value1', value2: 'value2' } }) => [myProp, myProps];
  
  wrapUseQuery({ queryFn }, keyFn);
  wrapUseInfiniteQuery({ queryFn }, keyFn);
  wrapUseQueryWithExtensions({ queryFn }, keyFn);
  wrapUseInfiniteQueryWithExtensions({ queryFn }, keyFn);
})

it('passes query component props to queryFn', async () => {
  const keyFn = (variables) => [variables];
  const queryFn = ({ queryKey }) => Promise.resolve(queryKey);

  const MyQueryComponent = wrapUseQuery({ queryFn }, keyFn);

  expect(MyQueryComponent).toBeDefined();

  const variables = [{ myProp: 'my-key-lajksdf', value1: 'value1-jioajsdf', value2: 'value2-joifds' }];

  function MyQueryHook() {
    const { data } = MyQueryComponent.use(variables);
    return <div data-testid="my-query-hook">{JSON.stringify(data)}</div>;
  }

  const { getByTestId } = render(
    <>
      {/* query */}
      <MyQueryComponent variables={variables} render={(data) => 
        <div data-testid="my-query-component">{JSON.stringify(data)}</div>
      } />
      <MyQueryHook />
    </>
  );

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent(JSON.stringify(variables));
    expect(getByTestId('my-query-hook')).toHaveTextContent(JSON.stringify(variables));
  })
})

it('query component shows default loading provided via QcProvider', async () => {
  const MyQueryComponent = wrapUseQueryWithExtensions({
    queryFn: () => {
      return new Promise(resolve => setTimeout(() => resolve(0), 300));
    },
  });

  const { getByTestId } = render(
    <QcProvider loading={<div data-testid="loading-state">default loading...</div>}>
      <MyQueryComponent render={_ => null} />
    </QcProvider>
  );

  expect(getByTestId('loading-state')).toHaveTextContent('default loading...');
})

it('query component can override default loading element', async () => {
  const MyQueryComponent = wrapUseQueryWithExtensions({
    queryFn: () => {
      return new Promise(resolve => setTimeout(() => resolve(0), 300));
    },
  });

  const { getByTestId } = render(
    <QcProvider loading={<div data-testid="loading-state">default loading...</div>}>
      <MyQueryComponent loading={<div data-testid="loading-state">loading...</div>} render={_ => null} />
    </QcProvider>
  );

  expect(getByTestId('loading-state')).toHaveTextContent('loading...');
})

it('setting default error prop is provided', async () => {
  function CustomComponent() {
    const { error } = useQcDefaults();

    return error;
  }

  const { findByTestId } = render(
    <QcProvider error={<div data-testid="error-state">default error...</div>}>
      <CustomComponent />
    </QcProvider>
  );

  expect(await findByTestId('error-state')).toHaveTextContent('default error...');
})

it('passes extensions into keyFn when provided', async () => {
  const myKeyFn = (variables, extensions) => {
    return variables.map(variable => {
      if (typeof variable === 'function') {
        return variable(extensions);
      }

      return variable;
    });
  };
  const MyQueryComponent = wrapUseQueryWithExtensions({
    queryFn: ({ queryKey }) => {
      return Promise.resolve(queryKey);
    },
  }, myKeyFn);

  function QcProviderWithRouter({ children }) {
    const params = useParams();
    const [searchParams] = useSearchParams();

    return <QcExtensionsProvider extensions={{ searchParams, params }}>{children}</QcExtensionsProvider>;
  }

  const { getByTestId } = render(
    <QcProviderWithRouter>
      <MyQueryComponent variables={[x => x.searchParams.toString()]} render={(data) => 
        <div data-testid="my-query-component">{JSON.stringify(data)}</div>
      } />
    </QcProviderWithRouter>
  , { routerPath: '/?myProp=my-key&value1=value1&value2=value2' });

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent('["myProp=my-key&value1=value1&value2=value2"]');
  });
});

it('calls extensions hook when provided', async () => {
  const myKeyFn = (variables, extensions) => {
    return variables.map(variable => {
      if (typeof variable === 'function') {
        return variable(extensions);
      }

      return variable;
    });
  };
  const MyQueryComponent = wrapUseQueryWithExtensions({
    queryFn: ({ queryKey }) => {
      return Promise.resolve(queryKey);
    },
  }, myKeyFn);

  function useExtensions() {
    const params = useParams();
    const [searchParams] = useSearchParams();

    return { searchParams, params };
  }

  function QcProviderWithRouter({ children }) {
    return <QcExtensionsProvider extensions={useExtensions}>{children}</QcExtensionsProvider>;
  }

  const { getByTestId } = render(
    <QcProviderWithRouter>
      <MyQueryComponent variables={[x => x.searchParams.toString()]} render={(data) => 
        <div data-testid="my-query-component">{JSON.stringify(data)}</div>
      } />
    </QcProviderWithRouter>
  , { routerPath: '/?myProp=my-key&value1=value1&value2=value2' });

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent('["myProp=my-key&value1=value1&value2=value2"]');
  });
});