import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { TCatchProps } from './types';
import { useQcDefaults } from './qc-provider';
import { errorRender } from './utils';

export function Catch({ error, children }: TCatchProps) {
  const { error: defaultError } = useQcDefaults();

  const fallbackRender = errorRender(error || defaultError);

  return (
    <QueryErrorResetBoundary>
      {({ reset }: any) => (
        <ErrorBoundary onReset={reset} fallbackRender={fallbackRender}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}