import { ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { QCError } from './types';

export function errorRender(x: QCError): (args: FallbackProps) => ReactNode {
  return typeof x === 'function' ? x : () => x;
}

export function defaultDataFn<T>(data: unknown | unknown[]): T {
  return data as T;
}

export function defaultKeyFn<TVariables = unknown>(variables?: TVariables) {
  return [variables];
};

type TExtFn = (extensions?: Record<string, unknown>) => Record<string, unknown>;

export function all(keys: string[] = []): TExtFn {
  return function ({ searchParams = [], params = {} } = {}) {
    if (keys.length === 0) {
      return { 
        searchParams, 
        params 
      };
    }

    const oldSearchParams = new URLSearchParams(searchParams as URLSearchParams | [string, string][]);
    const newSearchParams = new URLSearchParams();
    
    for (const key of keys) {
      if (oldSearchParams.has(key)) {
        for (const value of oldSearchParams.getAll(key)) {
          newSearchParams.append(key, value);
        }
      }
    }

    return {
      searchParams: Array.from(newSearchParams),
      params: params,
    };
  };
}

export function append(pairs: [string, string][] = []): TExtFn {
  return function ({ searchParams = [], params = {} } = {}) {
    const newSearchParams = new URLSearchParams(searchParams as URLSearchParams | [string, string][]);

    for (const [key, value] of pairs) {
      newSearchParams.append(key, value);
    }

    return {
      searchParams: Array.from(newSearchParams),
      params: params,
    };
  };
}