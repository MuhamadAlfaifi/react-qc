import { QcProvider } from 'react-qc';
import { RouterProvider, createBrowserRouter, useSearchParams, useParams } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { routes } from './routes';
import { client } from './api/client';
import { Error } from './components/error';
import { Loading } from './components/loading';

const router = createBrowserRouter(routes);

function App() {
  return (
    <QueryClientProvider client={client}>
      <QcProvider loading={<Loading />} error={({ resetErrorBoundary, error }) => <Error onClick={resetErrorBoundary} error={error}></Error>} extensions={{ useSearchParams, useParams }}>
        <RouterProvider router={router} />
      </QcProvider>
    </QueryClientProvider>
  );
}

export default App
