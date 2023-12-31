import { createContext, useContext } from 'react';
import type { 
  QCDefaultsContext, 
  QCDefaultsProviderProps, 
} from './types';

const context = createContext<QCDefaultsContext>({
  error: ({ resetErrorBoundary }) => <div><div>an error occured!</div><button onClick={resetErrorBoundary}>resetErrorBoundary</button></div>,
  loading: 'loading...',
});

export function useQcDefaults() {
  return useContext(context);
}

export function QcProvider({ error, loading, children }: QCDefaultsProviderProps) {
  return (
    <context.Provider value={{ error, loading }}>
      {children}
    </context.Provider>
  );
}