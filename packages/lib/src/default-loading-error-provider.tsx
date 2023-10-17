import { createContext, useContext } from 'react';
import type { 
  DefaultLoadingErrorContext, 
  DefaultLoadingErrorProviderProps, 
} from '~/types';

const context = createContext<DefaultLoadingErrorContext>({
  error: ({ resetErrorBoundary }) => <div><div>an error occured!</div><button onClick={resetErrorBoundary}>resetErrorBoundary</button></div>,
  loading: 'loading...',
});

export function useDefaultLoadingError() {
  return useContext(context);
}

export function DefaultLoadingErrorProvider({ error, loading, children }: DefaultLoadingErrorProviderProps) {
  return (
    <context.Provider value={{ error, loading }}>
      {children}
    </context.Provider>
  );
}