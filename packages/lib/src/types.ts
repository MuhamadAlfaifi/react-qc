import type { ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';

export type QCError = (props: FallbackProps) => void;

export type QCLoading = ReactNode;

export type DefaultLoadingErrorContext = {
  error: QCError
  loading: QCLoading
};

export type DefaultLoadingErrorProviderProps = DefaultLoadingErrorContext & { children?: ReactNode };