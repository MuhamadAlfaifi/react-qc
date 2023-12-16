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

export function dangerouslyFetchNextPage(results: any, predicate: boolean | ((results: any) => boolean)) {
  if (length < 0 || typeof length !== 'number') {
    throw new Error('length must be a positive number');
  }

  if ('fetchNextPage' in results === false) {
    throw new Error('results must be a useInfiniteQuery result');
  }

  const { status, isFetchingNextPage, hasNextPage, fetchNextPage } = results;

  if (status === 'success' && !isFetchingNextPage && hasNextPage && (typeof predicate === 'function' ? predicate(results) : predicate)) {
    fetchNextPage({
      cancelRefetch: false,
    });
  }
}