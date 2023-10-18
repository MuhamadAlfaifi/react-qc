import { ReactNode } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { QCError } from './types';

export function errorRender(x: QCError): (args: FallbackProps) => ReactNode {
  return typeof x === 'function' ? x : () => x;
}