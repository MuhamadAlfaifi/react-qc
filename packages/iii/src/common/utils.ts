import { QCError, QCErrorRender } from './types';

export function errorRender(x: QCError): QCErrorRender {
  return typeof x === 'function' ? (props) => x({ ...props, retry: props.resetErrorBoundary }) : () => x;
}

export function interlace(a: TemplateStringsArray, b: string[] = []): string[] {
  const length = a.length + b.length;

  return Array.from({ length }, (_, idx) => idx % 2 === 0 ? a[idx / 2] : b[(idx - 1) / 2]);
}

export function s(strings: TemplateStringsArray, ...keys: string[]) {
  return ({ searchParams }: { searchParams: URLSearchParams }) => {
    const values = keys.map((x: string) => {
      const [key, defaultValue = key] = x.split('!');
      
      return searchParams.get(key) || defaultValue;
    });
    
    return interlace(strings, values).join('');
  };
}