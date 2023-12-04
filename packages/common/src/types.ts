import type { QueryClient, QueryKey, QueryStatus } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';

export type QCError = ((props: FallbackProps) => ReactNode) | ReactNode;

export type QCErrorRender = (props: FallbackProps) => ReactNode;

export type QCLoading = ReactNode;

export type QCDefaultsContext = {
  error: QCError
  loading: QCLoading,
};

export type QCDefaultsProviderProps = QCDefaultsContext & { children?: ReactNode };

export type QCExtensionsContext<T = Record<string, any>> = T | (() => T);

export type QCExtensionsProviderProps<T> = { extensions: QCExtensionsContext<T>, children: ReactNode };

export type TCatchProps = { error?: QCError, children?: ReactNode };

export type QueryStatusWithPending = QueryStatus | 'loading' | 'pending';

export type TVariableFn<T> = (...args: any[]) => T;

export type ExcludeFirst<T extends QueryKey> = T extends [any, ...infer Rest] 
    ? Rest extends [infer Single] ? Single | [Single] : Rest 
    : [];

export type ExcludeFirstTwo<T extends QueryKey> = T extends [any, any, ...infer Rest] 
    ? Rest extends [infer Single] ? Single | [Single] : Rest 
    : [];

export type TVariablesOrFnArray<T extends QueryKey> = {
  [K in keyof T]: T[K] | TVariableFn<T[K]>
};

export type Path<T extends QueryKey> = TVariableFn<T[0]> | T[0];
export type Body<T extends QueryKey> = TVariableFn<T[1]> | T[1];

export type Variables<T extends QueryKey> = TVariableFn<T> | TVariablesOrFnArray<T>;

export type LoadingProps = {
  hasLoading?: boolean,
  loading?: ReactNode,
}

export type Client = {
  client?: QueryClient,
};

export type RenderProp<T, K> = (data: T, results: K) => ReactNode;

export type RenderProps<T, K> = {
  render?: RenderProp<T, K>,
  children?: RenderProp<T, K>,
};