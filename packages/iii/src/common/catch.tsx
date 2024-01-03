import { QueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { TCatchProps } from './types';
import { useQcDefaults } from './qc-provider';
import { errorRender } from './utils';

export function Catch(props: TCatchProps) {
  const { error: defaultError } = useQcDefaults();

  const fallbackRender = errorRender('error' in props ? props.error : defaultError);

  return (
    <QueryErrorResetBoundary>
      {({ reset }: any) => (
        <ErrorBoundary onReset={reset} fallbackRender={fallbackRender}>
          {props.children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}