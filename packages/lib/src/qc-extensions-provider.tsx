import { createContext, useContext } from 'react';
import type { 
  QCExtensionsContext, 
  QCExtensionsProviderProps, 
} from './types';

const context = createContext<QCExtensionsContext>({
  extensions: undefined,
  useExtensions: undefined,
});

export function useQcExtensions() {
  return useContext<QCExtensionsContext>(context);
}

export function QcExtensionsProvider({ extensions, useExtensions, children }: QCExtensionsProviderProps<any>) {
  return (
    <context.Provider value={{ extensions, useExtensions }}>
      {children}
    </context.Provider>
  );
}