import { waitFor } from '@testing-library/react';
import { render } from './shared';
import { defineQueryComponent } from '../src/define-query';
import { defineInfiniteQueryComponent } from '../src/define-infinite-query';
import { DefaultLoadingErrorProvider, useDefaultLoadingError } from '../src/default-loading-error-provider';
import React from 'react';

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

  function MyHook() {
    const { data } = MyQueryComponent.useQuery({ myProp: 'my-key-lajksdf', value1: 'value1-jioajsdf', value2: 'value2-joifds' });
    return <div data-testid="my-hook">{JSON.stringify(data)}</div>;
  }

  const { getByTestId } = render(
    <>
      <MyQueryComponent variables={{ myProp: 'my-key', value1: 'value1', value2: 'value2' }} render={({ data }) => 
        <div data-testid="my-query-component">{JSON.stringify(data)}</div>
      } />
      <MyHook />
    </>
  );

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent('[{"myProp":"my-key","value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-hook')).toHaveTextContent('[{"myProp":"my-key-lajksdf","value1":"value1-jioajsdf","value2":"value2-joifds"}]')
  })
})

it('query component shows default loading provided via DefaultLoadingErrorProvider', async () => {
  const MyQueryComponent = defineQueryComponent({
    queryFn: () => {
      return new Promise(resolve => setTimeout(() => resolve(0), 300));
    },
  });

  const { getByTestId } = render(
    <DefaultLoadingErrorProvider loading={<div data-testid="loading-state">default loading...</div>}>
      <MyQueryComponent render={_ => null} />
    </DefaultLoadingErrorProvider>
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
    <DefaultLoadingErrorProvider loading={<div data-testid="loading-state">default loading...</div>}>
      <MyQueryComponent loading={<div data-testid="loading-state">loading...</div>} render={_ => null} />
    </DefaultLoadingErrorProvider>
  );

  expect(getByTestId('loading-state')).toHaveTextContent('loading...');
})

it('setting default error prop is provided', async () => {
  function CustomComponent() {
    const { error } = useDefaultLoadingError();

    return error;
  }

  const { findByTestId } = render(
    <DefaultLoadingErrorProvider error={<div data-testid="error-state">default error...</div>}>
      <CustomComponent />
    </DefaultLoadingErrorProvider>
  );

  expect(await findByTestId('error-state')).toHaveTextContent('default error...');
})