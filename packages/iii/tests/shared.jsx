import { QueryClient, QueryClientProvider } from 'react-query';
import { render as baseRender } from '@testing-library/react';
import { StrictMode } from 'react';
import { MemoryRouter } from 'react-router-dom';

const client = new QueryClient();

export function Providers({ children, routerPath }) {
  return (
    <StrictMode>
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[routerPath]}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}

export function render(ui, { routerPath, ...options } = { routerPath: '/' }) {
  return baseRender(ui, { wrapper: (props) => <Providers {...props} routerPath={routerPath} />, ...options });
}