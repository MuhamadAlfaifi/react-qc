import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { TCatchProps } from './types';
import { useDefaultLoadingError } from './default-loading-error-provider';
import { errorRender } from './utils';

export function Catch({ error, children }: TCatchProps) {
  const { error: defaultError } = useDefaultLoadingError();

  const fallbackRender = errorRender(error || defaultError);

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={fallbackRender}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}