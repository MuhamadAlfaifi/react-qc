import type { QueryStatus } from '@tanstack/react-query';
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

export type QCExtensionsContext<T = Record<string, unknown>> = {
  extensions?: T,
  useExtensions?: () => T,
}

export type QCExtensionsProviderProps<T> = QCExtensionsContext<T> & { children?: ReactNode };

export type TCatchProps = { error?: QCError, children?: ReactNode };

export type QueryStatusWithPending = QueryStatus | 'pending';

export type TVariableFn<T> = (...args: any[]) => T;