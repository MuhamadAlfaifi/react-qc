import { ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { QCError } from './types';

export function errorRender(x: QCError): (args: FallbackProps) => ReactNode {
  return typeof x === 'function' ? x : () => x;
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

export function interlace(a: TemplateStringsArray, b: string[] = []): string[] {
  const length = a.length + b.length;

  return Array.from({ length }, (_, idx) => idx % 2 === 0 ? a[idx / 2] : b[(idx - 1) / 2]);
}

export function s(strings: TemplateStringsArray, ...keys: string[]) {
  return ({ searchParams }: { searchParams: URLSearchParams }) => {
    const values = keys.map((x: string) => {
      const [key, defaultValue = ''] = x.split('!');
      
      return searchParams.get(key) || defaultValue;
    });
    
    return interlace(strings, values).join('');
  };
}