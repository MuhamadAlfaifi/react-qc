import { waitFor } from '@testing-library/react';
import { render } from './shared';
import { defineQueryComponent } from '../src/define-query';
import { defineInfiniteQueryComponent } from '../src/define-infinite-query';
import { QcProvider, useQcDefaults } from '../src/qc-provider';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { searchAppend, searchOnly } from '../src/utils';

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
    const { data } = MyQueryComponent.useQuery({ myProp: 'my-key-lajksdf', value1: 'value1-jioajsdf', value2: 'value2-joifds' });
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
    expect(getByTestId('my-query-component')).toHaveTextContent('[{"myProp":"my-key","value1":"value1","value2":"value2","__use":{}}]')
    expect(getByTestId('my-query-hook')).toHaveTextContent('[{"myProp":"my-key-lajksdf","value1":"value1-jioajsdf","value2":"value2-joifds","__use":{}}]')
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

it('includes extension into variables when provided', async () => {
  const MyQueryComponent = defineQueryComponent({
    queryFn: ({ queryKey }) => {
      return Promise.resolve(queryKey);
    },
  });

  const { getByTestId } = render(
    <QcProvider extensions={{ useSearchParams, useParams }}>
      <MyQueryComponent variables={{ __use: ['useSearchParams'], myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component">{JSON.stringify(data)}</div>
      } />
      <MyQueryComponent variables={{ __use: searchAppend([['value3', 'value3']]), myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component3">{JSON.stringify(data)}</div>
      } />
      <MyQueryComponent variables={{ __use: searchOnly(['myProp']), myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component4">{JSON.stringify(data)}</div>
      } />
    </QcProvider>
  , { routerPath: '/?myProp=my-key&value1=value1&value2=value2' });

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent('[{"__use":{"searchParams":[["myProp","my-key"],["value1","value1"],["value2","value2"]]},"myProp":"my-key","value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-query-component3')).toHaveTextContent('[{"__use":{"searchParams":[["myProp","my-key"],["value1","value1"],["value2","value2"],["value3","value3"]],"params":{}},"myProp":"my-key","value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-query-component4')).toHaveTextContent('[{"__use":{"searchParams":[["myProp","my-key"]],"params":{}},"myProp":"my-key","value1":"value1","value2":"value2"}]')
  });
});