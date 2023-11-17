import { QcProvider } from 'react-qc';
import { RouterProvider, createBrowserRouter, useSearchParams, useParams } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { client } from './api/client';
import { Error } from './components/error';
import { Loading } from './components/loading';
import RootLayoutPage from './pages/root-layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayoutPage />,
  }
]);

function useExtensions() {
  return {
    searchParams: useSearchParams()[0],
    params: useParams(),
  };
}

function App() {
  return (
    <QueryClientProvider client={client}>
      <QcProvider loading={<Loading />} error={({ resetErrorBoundary, error }) => <Error onClick={resetErrorBoundary} error={error}></Error>} useExtensions={useExtensions}>
        <RouterProvider router={router} />
      </QcProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App
