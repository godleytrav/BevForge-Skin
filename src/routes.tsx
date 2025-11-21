import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const IndexPage = lazy(() => import('./pages/index'));
const NotFoundPage = lazy(() => import('./pages/_404'));
const OSPage = lazy(() => import('./pages/os'));
const FlowPage = lazy(() => import('./pages/flow'));
const LabPage = lazy(() => import('./pages/lab'));
const OpsPage = lazy(() => import('./pages/ops'));
const OpsSalesPage = lazy(() => import('./pages/ops/sales'));
const OpsOrdersPage = lazy(() => import('./pages/ops/orders'));
const OpsInventoryPage = lazy(() => import('./pages/ops/inventory'));
const OpsReportsPage = lazy(() => import('./pages/ops/reports'));
const OpsCompliancePage = lazy(() => import('./pages/ops/compliance'));
const OpsTaxPage = lazy(() => import('./pages/ops/tax'));
const ConnectPage = lazy(() => import('./pages/connect'));
const ReportsPage = lazy(() => import('./pages/reports'));
const SettingsPage = lazy(() => import('./pages/settings'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/os',
    element: <OSPage />,
  },
  {
    path: '/flow',
    element: <FlowPage />,
  },
  {
    path: '/lab',
    element: <LabPage />,
  },
  {
    path: '/ops',
    element: <OpsPage />,
  },
  {
    path: '/ops/sales',
    element: <OpsSalesPage />,
  },
  {
    path: '/ops/orders',
    element: <OpsOrdersPage />,
  },
  {
    path: '/ops/inventory',
    element: <OpsInventoryPage />,
  },
  {
    path: '/ops/reports',
    element: <OpsReportsPage />,
  },
  {
    path: '/ops/compliance',
    element: <OpsCompliancePage />,
  },
  {
    path: '/ops/tax',
    element: <OpsTaxPage />,
  },
  {
    path: '/connect',
    element: <ConnectPage />,
  },
  {
    path: '/reports',
    element: <ReportsPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
