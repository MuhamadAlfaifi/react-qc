import { ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { QCError, TExtensions, TUseFn } from './types';

export function errorRender(x: QCError): (args: FallbackProps) => ReactNode {
  return typeof x === 'function' ? x : () => x;
}

export function defaultDataFn<T>(data: unknown | unknown[]): T {
  return data as T;
}

export function defaultKeyFn<TVariables = unknown>(variables?: TVariables) {
  return [variables];
};

export function searchAppend(pairs: [string, string][], injectParams = true): TUseFn {
  return function ({ searchParams, params }: TExtensions) {
    const newSearchParams = new URLSearchParams(searchParams);

    for (const [key, value] of pairs) {
      newSearchParams.append(key, value);
    }

    type ObjType = {
      searchParams: [string, string][];
      params?: Record<string, unknown>;
    }

    const obj: ObjType = {
      searchParams: Array.from(newSearchParams)
    };

    if (injectParams && params) {
      obj.params = params;
    }

    return obj;
  };
}

export function searchOnly(keys: string[], injectParams = true): TUseFn {
  return function ({ searchParams, params }: TExtensions) {
    const newSearchParams = new URLSearchParams();
    
    for (const key of keys) {
      if (searchParams?.has(key)) {
        for (const value of searchParams.getAll(key)) {
          newSearchParams.append(key, value);
        }
      }
    }

    type ObjType = {
      searchParams: [string, string][];
      params?: Record<string, unknown>;
    }

    const obj: ObjType = {
      searchParams: Array.from(newSearchParams)
    };

    if (injectParams && params) {
      obj.params = params;
    }

    return obj;
  };
}