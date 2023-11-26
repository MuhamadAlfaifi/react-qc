import { ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { QCError } from './types';

// @ts-expect-error
import { UseInfiniteQueryResult, useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

export function errorRender(x: QCError): (args: FallbackProps) => ReactNode {
  return typeof x === 'function' ? x : () => x;
}

export function defaultDataFn<T>(data: unknown | unknown[]): T {
  return data as T;
}

export const parameters = (params: any[] | URLSearchParams = []) => (searchParams: URLSearchParams | any[] = []) => {
  const _params = Array.from(params)
  const _searchParams = new URLSearchParams(searchParams);

  if (_params.length === 0) {
    return Array.from(_searchParams);
  }

  let selection = _params.filter(i => typeof i === 'string').flatMap((i: string) => _searchParams.getAll(i).map((value) => [i, value]));

  if (selection.length === 0) {
    selection = Array.from(_searchParams);
  }

  _params.filter(i => Array.isArray(i)).forEach((i: any[]) => {
    const [key, value] = i;

    if (value) {
      selection.push([key, value]);
    }
  });

  return selection;
};

export const detectReactQueryVersion = () => {
  if (useSuspenseQuery) {
    return 5;
  }

  return 4;
}

export const isInfinite = <T, K>(query: any): query is UseInfiniteQueryResult<T, K> => {
  return typeof query.fetchNextPage === 'function';
}

export const isUseInfinite = (hook: any): hook is typeof useInfiniteQuery => {
  return typeof hook === 'function' && isInfinite(hook({ queryKey: [] }));
}