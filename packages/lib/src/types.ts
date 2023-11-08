import type { InfiniteData, QueryKey, QueryStatus, UseInfiniteQueryOptions, UseInfiniteQueryResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';

export type QCError = ((props: FallbackProps) => ReactNode) | ReactNode;

export type QCErrorRender = (props: FallbackProps) => ReactNode;

export type QCLoading = ReactNode;

export type QCDefaultsContext = {
  error: QCError
  loading: QCLoading,
  extensions?: Record<string, unknown>,
  useExtensions?: () => Record<string, unknown>,
};

export type QCDefaultsProviderProps = QCDefaultsContext & { children?: ReactNode };

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