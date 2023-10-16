import { lazy } from 'react';

import RootLayout from './pages/root-layout';

const lazyComponents = [
  {
    index: true,
    component: lazy(() => import('./pages/home')),
    exact: true,
  },
];

const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      ...lazyComponents.map((path) => {      
        return {
          ...path,
          element: <path.component />,
        };
      }),
    ]
  },
];

export { routes };