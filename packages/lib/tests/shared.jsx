import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as baseRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const client = new QueryClient();

export function Providers({ children, routerPath }) {
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[routerPath]}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

export function render(ui, { routerPath, ...options } = { routerPath: '/' }) {
  return baseRender(ui, { wrapper: (props) => <Providers {...props} routerPath={routerPath} />, ...options });
}