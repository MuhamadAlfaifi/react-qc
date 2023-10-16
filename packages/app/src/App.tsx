import { DefaultLoadingErrorProvider } from 'react-qc';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { client } from './api/client';
import { Error } from './components/error';
import { Loading } from './components/loading';

const router = createBrowserRouter(routes);

function App() {
  return (
    <QueryClientProvider client={client}>
      <DefaultLoadingErrorProvider loading={<Loading />} error={({ resetErrorBoundary, error }) => <Error onClick={resetErrorBoundary} error={error}></Error>}>
        <RouterProvider router={router} />
      </DefaultLoadingErrorProvider>
    </QueryClientProvider>
  );
}

export default App
