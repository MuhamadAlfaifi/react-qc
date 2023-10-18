import { expect, test } from 'vitest'
import { waitFor } from '@testing-library/react';
import { render } from './shared';
import { defineQueryComponent } from '../src/define-query';
import { DefaultLoadingErrorProvider, useDefaultLoadingError } from '../src/default-loading-error-provider';

test('does not fail when creating query component', () => {
  const options = {
    keyFn: ({ myProp = 'my-key', myProps = { value1: 'value1', value2: 'value2' } }) => [myProp, myProps],
    queryFn: () => Promise.resolve(10),
  };

  defineQueryComponent(options);
})

test('passes query component props to queryFn', async () => {
  const MyQueryComponent = defineQueryComponent({
    keyFn: ({ myProp, variables }) => [myProp, variables],
    queryFn: ({ queryKey }) => {
      return Promise.resolve(queryKey)
    },
  });

  expect(MyQueryComponent).toBeDefined();

  function MyHook() {
    const { data } = MyQueryComponent.useQuery({ myProp: 'my-key-lajksdf', variables: { value1: 'value1-jioajsdf', value2: 'value2-joifds' } });
    return <div data-testid="my-hook">{JSON.stringify(data)}</div>;
  }

  const { getByTestId } = render(
    <>
      <MyQueryComponent myProp="my-key" variables={{ value1: 'value1', value2: 'value2' }} render={key => 
        <div data-testid="my-query-component">{JSON.stringify(key)}</div>
      } />
      <MyHook />
    </>
  );

  await waitFor(() => {
    expect(getByTestId('my-query-component')).toHaveTextContent('["my-key",{"value1":"value1","value2":"value2"}]')
    expect(getByTestId('my-hook')).toHaveTextContent('["my-key-lajksdf",{"value1":"value1-jioajsdf","value2":"value2-joifds"}]')
  })
})

test('query component shows default loading provided via DefaultLoadingErrorProvider', async () => {
  const MyQueryComponent = defineQueryComponent({
    keyFn: ({}) => ['random-key', {}],
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

test('query component can override default loading element', async () => {
  const MyQueryComponent = defineQueryComponent({
    keyFn: ({}) => ['random-key', {}],
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

test('useDefaultLoadingError read context for defaults correctly', async () => {
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