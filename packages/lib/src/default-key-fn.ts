import { TVariableFn } from './types';
import { QueryKey } from '@tanstack/react-query';

export function defaultKeyFn<T extends TVariableFn<unknown> | TVariableFn<unknown>[] | unknown[], Extensions = never>(variables: T, extensions: Extensions): QueryKey {
  if (typeof variables === 'function') {
    return variables(extensions) as unknown as QueryKey;
  }
  
  return variables.map((variable) => {
    if (typeof variable === 'function') {
      return variable(extensions);
    }

    return variable;
  }) as unknown as QueryKey;
}