import type { QueryKey, QueryStatus, UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';

export type QCError = ((props: FallbackProps) => ReactNode) | ReactNode;

export type QCErrorRender = (props: FallbackProps) => ReactNode;

export type QCLoading = ReactNode;

export type QCDefaultsContext = {
  error: QCError
  loading: QCLoading,
  extensions?: Record<string, unknown>,
};

export type QCDefaultsProviderProps = QCDefaultsContext & { children?: ReactNode };

export type TCatchProps = { error?: QCError, children?: ReactNode };

export type QueryStatusWithPending = QueryStatus | 'pending';

export type TQueryResults<T> = {
  data: T,
  query: UseQueryResult,
}

export type TInfiniteQueryResults<T> = {
  data: T,
  query: UseInfiniteQueryResult,
}

export type TRenderQueryResults<T> = (props: TQueryResults<T>) => ReactNode;

export type TRenderInfiniteResults<T> = (props: TInfiniteQueryResults<T>) => ReactNode;

export type TKeyFn<T> = (options: T) => QueryKey;

export type TDataFn<T> = (data: unknown) => T;

export type TPagesFn<T> = (data: unknown[]) => T;

export type TUnresolvedUse = string[] | (() => Record<string, unknown>);

export type TResolvedUse = Record<string, unknown>;

export type WithUnresolvedUse<TVariables> = TVariables & { 
  __use?: TUnresolvedUse,
};

export type WithResolvedUse<TVariables> = TVariables & {
  __use: TResolvedUse,
};