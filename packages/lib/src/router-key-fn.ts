import isPlainObject from 'lodash.isplainobject';
import { TVariableFn } from './types';
import { QueryKey } from '@tanstack/react-query';

export type TReactRouterExtensions = {
  params: Record<string, string>,
  searchParams: URLSearchParams,
};

function usingRouter(obj: Record<string, unknown>): obj is TReactRouterExtensions {
  return isPlainObject(obj.params) && obj.searchParams instanceof URLSearchParams;
}

function getQueryKeyApplyingExtensions<T extends TVariableFn<unknown> | TVariableFn<unknown>[] | unknown[]>(variables: T, extensions: TReactRouterExtensions): QueryKey {
  if (typeof variables === 'function') {
    return variables(extensions) as unknown as QueryKey;
  }
  
  const pathParser = getPathParser(variables[0]);
  const bodyParser = getBodyParser(variables[1]);

  const path = pathParser.hasTokens() 
    ? pathParser.apply(extensions) 
    : variables[0];
  const body = bodyParser.hasTokens()
    ? bodyParser.apply(extensions)
    : variables[1];

  return [path, body];
}

function getBodyParser(body: unknown) {
  function hasTokens() {
    return typeof body === 'function';
  }

  function apply(extensions: TReactRouterExtensions) {
    return typeof body === 'function' ? body(extensions) : body;
  }

  return {
    hasTokens,
    apply,
  }
}

function getPathParser(path: unknown) {
  const fallbacks: Record<string, string> = {};

  function hasTokens() {
    return typeof path === 'string' && /{[^}]+}/.test(path) || typeof path === 'function';
  }

  function extractDefaultsFromPath(path: string) {
    const regex = /{([^!]+)!([^}]+)}/g;
    let match;
    
    while ((match = regex.exec(path)) !== null) {
      const variableName = match[1];
      const defaultValue = match[2];
      fallbacks[variableName] = defaultValue;
    }
    
    path = path.replace(regex, '{$1}');
  }

  function apply(extensions: TReactRouterExtensions) {
    if (!hasTokens()) {
      return path;
    }

    if (typeof path === 'function') {
      return path(extensions);
    }
    
    extractDefaultsFromPath(path as string);

    return (path as string).replace(/{([^}]+)}/g, (_, variable) => {
      const original = `{${variable}}`;
      const paramValue = extensions.searchParams?.get(variable) || extensions.params?.[variable];
      
      return !!paramValue ? paramValue : !!fallbacks[variable] ? fallbacks[variable] : original;
    });
  }

  return {
    hasTokens,
    apply,
  };
};

export function routerKeyFn<T extends TVariableFn<unknown> | TVariableFn<unknown>[] | unknown[]>(variables: T, extensions: Record<string, unknown>): QueryKey {
  if (!usingRouter(extensions)) {
    throw new Error('Cannot use routerKeyFn without params and searchParams extensions');
  }

  return getQueryKeyApplyingExtensions(variables, extensions);
}