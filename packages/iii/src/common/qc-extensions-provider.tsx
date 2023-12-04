import { createContext, useContext } from 'react';
import type { 
  QCExtensionsContext, 
  QCExtensionsProviderProps, 
} from './types';

function createExtensionsContext<T>(defaultValue: T) {
  const context = createContext<QCExtensionsContext<T>>(defaultValue);
  
  function useQcExtensions() {
    return useContext(context);
  }

  function QcExtensionsProvider({ extensions, children }: QCExtensionsProviderProps<T>) {
    return (
      <context.Provider value={extensions}>
        {children}
      </context.Provider>
    );
  }

  return { useQcExtensions, QcExtensionsProvider } as const;
}

const { useQcExtensions, QcExtensionsProvider } = createExtensionsContext({});

export { useQcExtensions, QcExtensionsProvider };