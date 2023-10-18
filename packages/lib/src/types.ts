import { QueryStatus } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';

export type QCError = ((props: FallbackProps) => ReactNode) | ReactNode;

export type QCErrorRender = (props: FallbackProps) => ReactNode;

export type QCLoading = ReactNode;

export type DefaultLoadingErrorContext = {
  error: QCError
  loading: QCLoading
};

export type DefaultLoadingErrorProviderProps = DefaultLoadingErrorContext & { children?: ReactNode };

export type TCatchProps = { error?: QCError, children?: ReactNode };

export type QueryStatusWithPending = QueryStatus | 'pending';