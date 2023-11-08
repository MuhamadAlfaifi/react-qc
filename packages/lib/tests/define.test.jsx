import { waitFor } from '@testing-library/react';
import { render } from './shared';
import { defineQueryComponent } from '../src/define-query';
import { defineInfiniteQueryComponent } from '../src/define-infinite-query';
import { QcProvider, useQcDefaults } from '../src/qc-provider';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { all, append } from '../src/utils';

it('does not fail when creating query component', () => {
  const queryFn = () => Promise.resolve(10);

  defineQueryComponent({ queryFn });
  
  const keyFn = ({ myProp = 'my-key', myProps = { value1: 'value1', value2: 'value2' } }) => [myProp, myProps];
  
  defineQueryComponent({ queryFn }, keyFn);
  defineInfiniteQueryComponent({ queryFn }, keyFn);
})

it('passes query component props to queryFn', async () => {
  const keyFn = (variables) => [variables];
  const queryFn = ({ queryKey }) => Promise.resolve(queryKey);

  const MyQueryComponent = defineQueryComponent({ queryFn }, keyFn);

  expect(MyQueryComponent).toBeDefined();

  function MyQueryHook() {
    const { data } = MyQueryComponent.use({ myProp: 'my-key-lajksdf', value1: 'value1-jioajsdf', value2: 'value2-joifds' });
    return <div data-testid="my-query-hook">{JSON.stringify(data)}</div>;
  }

  const { getByTestId } = render(
    <>
      {/* query */}
      <MyQueryComponent variables={{ myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component">{JSON.stringify(data)}</div>
      } />
      <MyQueryHook />
    </>
  );

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent('[{"myProp":"my-key","value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-query-hook')).toHaveTextContent('[{"myProp":"my-key-lajksdf","value1":"value1-jioajsdf","value2":"value2-joifds"}]')
  })
})

it('query component shows default loading provided via QcProvider', async () => {
  const MyQueryComponent = defineQueryComponent({
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
  const MyQueryComponent = defineQueryComponent({
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
  const keyFnWithExtensions = ({ _ext, ...variables }, extensions) => {
    const variablesWithExt = { _ext: _ext(extensions), ...variables };

    return [variablesWithExt];
  };
  const MyQueryComponent = defineQueryComponent({
    queryFn: ({ queryKey }) => {
      return Promise.resolve(queryKey);
    },
  }, keyFnWithExtensions);

  function QcProviderWithRouter({ children }) {
    const params = useParams();
    const [searchParams] = useSearchParams();

    return <QcProvider extensions={{ searchParams, params }}>{children}</QcProvider>;
  }

  const { getByTestId } = render(
    <QcProviderWithRouter>
      <MyQueryComponent variables={{ _ext: all(), myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component">{JSON.stringify(data)}</div>
      } />
      <MyQueryComponent variables={{ _ext: append([['value3', 'value3']]), myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component3">{JSON.stringify(data)}</div>
      } />
      <MyQueryComponent variables={{ _ext: all(['myProp']), myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component4">{JSON.stringify(data)}</div>
      } />
    </QcProviderWithRouter>
  , { routerPath: '/?myProp=my-key&value1=value1&value2=value2' });

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent('[{"_ext":{"searchParams":[["myProp","my-key"],["value1","value1"],["value2","value2"]],"params":{}},"myProp":"my-key","value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-query-component3')).toHaveTextContent('[{"_ext":{"searchParams":[["myProp","my-key"],["value1","value1"],["value2","value2"],["value3","value3"]],"params":{}},"myProp":"my-key","value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-query-component4')).toHaveTextContent('[{"_ext":{"searchParams":[["myProp","my-key"]],"params":{}},"myProp":"my-key","value1":"value1","value2":"value2"}]')
  });
});

it('calls useExtensions hook when provided and pass results to keyFn', async () => {
  const keyFnWithExtensions = ({ _ext, ...variables }, extensions) => {
    const variablesWithExt = { _ext: _ext(extensions), ...variables };

    return [variablesWithExt];
  };
  const MyQueryComponent = defineQueryComponent({
    queryFn: ({ queryKey }) => {
      return Promise.resolve(queryKey);
    },
  }, keyFnWithExtensions);

  function useExtensions() {
    const params = useParams();
    const [searchParams] = useSearchParams();

    return { searchParams, params };
  }

  const { getByTestId } = render(
    <QcProvider useExtensions={useExtensions}>
      <MyQueryComponent variables={{ _ext: all(), myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component">{JSON.stringify(data)}</div>
      } />
      <MyQueryComponent variables={{ _ext: append([['value3', 'value3']]), myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component3">{JSON.stringify(data)}</div>
      } />
      <MyQueryComponent variables={{ _ext: all(['myProp']), myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component4">{JSON.stringify(data)}</div>
      } />
    </QcProvider>
  , { routerPath: '/?myProp=my-key&value1=value1&value2=value2' });

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent('[{"_ext":{"searchParams":[["myProp","my-key"],["value1","value1"],["value2","value2"]],"params":{}},"myProp":"my-key","value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-query-component3')).toHaveTextContent('[{"_ext":{"searchParams":[["myProp","my-key"],["value1","value1"],["value2","value2"],["value3","value3"]],"params":{}},"myProp":"my-key","value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-query-component4')).toHaveTextContent('[{"_ext":{"searchParams":[["myProp","my-key"]],"params":{}},"myProp":"my-key","value1":"value1","value2":"value2"}]')
  });
});