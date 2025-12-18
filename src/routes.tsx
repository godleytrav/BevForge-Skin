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
const OpsBatchesPage = lazy(() => import('./pages/ops/batches'));
const OpsReportsPage = lazy(() => import('./pages/ops/reports'));
const OpsCompliancePage = lazy(() => import('./pages/ops/compliance'));
const OpsTaxPage = lazy(() => import('./pages/ops/tax'));
const ConnectPage = lazy(() => import('./pages/connect'));
const ReportsPage = lazy(() => import('./pages/reports'));
const SettingsPage = lazy(() => import('./pages/settings'));

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: IndexPage,
  },
  {
    path: '/os',
    Component: OSPage,
  },
  {
    path: '/flow',
    Component: FlowPage,
  },
  {
    path: '/lab',
    Component: LabPage,
  },
  {
    path: '/ops',
    Component: OpsPage,
  },
  {
    path: '/ops/sales',
    Component: OpsSalesPage,
  },
  {
    path: '/ops/orders',
    Component: OpsOrdersPage,
  },
  {
    path: '/ops/inventory',
    Component: OpsInventoryPage,
  },
  {
    path: '/ops/batches',
    Component: OpsBatchesPage,
  },
  {
    path: '/ops/reports',
    Component: OpsReportsPage,
  },
  {
    path: '/ops/compliance',
    Component: OpsCompliancePage,
  },
  {
    path: '/ops/tax',
    Component: OpsTaxPage,
  },
  {
    path: '/connect',
    Component: ConnectPage,
  },
  {
    path: '/reports',
    Component: ReportsPage,
  },
  {
    path: '/settings',
    Component: SettingsPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
];
