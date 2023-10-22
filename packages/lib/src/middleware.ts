import { TExtMiddleware, TResolvedExt } from './types';

export function all(keys: string[] = []): TExtMiddleware {
  return function ({ searchParams, params }: TResolvedExt) {
    if (keys.length === 0) {
      return { 
        searchParams, 
        params 
      };
    }

    const oldSearchParams = new URLSearchParams(searchParams);
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

export function append(pairs: [string, string][]): TExtMiddleware {
  return function ({ searchParams, params }: TResolvedExt) {
    const newSearchParams = new URLSearchParams(searchParams);

    for (const [key, value] of pairs) {
      newSearchParams.append(key, value);
    }
    const obj = {
      searchParams: Array.from(newSearchParams),
      params: params,
    };

    return obj;
  };
}