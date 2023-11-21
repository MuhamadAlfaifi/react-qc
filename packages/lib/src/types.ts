import type { InfiniteData, QueryKey, QueryStatus, UseInfiniteQueryOptions, UseInfiniteQueryResult, UseQueryOptions, UseQueryResult, useInfiniteQuery, useQuery } from '@tanstack/react-query';
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

export type QCExtensionsContext = {
  extensions?: Record<string, unknown>,
  useExtensions?: () => Record<string, unknown>,
}

export type QCExtensionsProviderProps = QCExtensionsContext & { children?: ReactNode };

export type TCatchProps = { error?: QCError, children?: ReactNode };

export type QueryStatusWithPending = QueryStatus | 'pending';

export type TQueryOptions<T = unknown> = Omit<Partial<UseQueryOptions>, 'select'> & { select?: (data: any) => T };

export type TQueryResults<T = unknown> = Omit<UseQueryResult<unknown, unknown>, 'data'> & { data: T };

export type TRenderQueryResults<T> = (props: TQueryResults<T>) => ReactNode;

export type TInfiniteQueryResults<T = unknown> = Omit<UseInfiniteQueryResult, 'data'> & { data: T };

export type TInfiniteQueryOptions<T = unknown> = Omit<Partial<UseInfiniteQueryOptions>, 'select'> & { select?: (data: InfiniteData<any>) => T };

export type TRenderInfiniteResults<T> = (props: TInfiniteQueryResults<T>) => ReactNode;

export type TKeyFn<T> = (options: T, extensions?: Record<string, unknown>) => QueryKey;

export type TDataFn<T> = (data: any) => T;

export type TBodyFn<T> = (...args: any[]) => T;

export type IBody<T> = T | TBodyFn<T>;

export type TRequestVariables<T> = [string, IBody<T>] | TBodyFn<T>;

// ------------------------------

export type TOptions<T = unknown, U = never> = U extends typeof useInfiniteQuery 
  ? Omit<UseInfiniteQueryOptions, 'select'> & { select?: (data: InfiniteData<any>) => T, initialPageParam?: any } 
  : U extends typeof useQuery
    ? Omit<UseQueryOptions, 'select'> & { select?: (data: any) => T }
    : never;

export type TResults<T = unknown, U = never> = U extends typeof useInfiniteQuery
  ? Omit<UseInfiniteQueryResult, 'data'> & { data: T }
  : U extends typeof useQuery
    ? Omit<UseQueryResult, 'data'> & { data: T }
    : never;

export type TRenderResults<T, U = never> = (props: TResults<T, U>) => ReactNode;

export type TVariableFn<T> = (...args: any[]) => T;

export type TPath<T = never> = TVariableFn<T> | T | never;

export type TBody<T = never> = TVariableFn<T> | T | never;

export type TInput<TVariables extends unknown[]> = 
  TVariables | [TPath<TVariables[0]>, TBody<TVariables[1]>] | TVariableFn<TVariables>;