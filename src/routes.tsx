import { RouteObject } from 'react-router-dom';

// Direct imports instead of lazy loading
import IndexPage from './pages/index';
import NotFoundPage from './pages/_404';
import ConnectPage from './pages/connect';
import FlowPage from './pages/flow';
import LabPage from './pages/lab';
import OpsPage from './pages/ops';
import OsPage from './pages/os';
import ReportsPage from './pages/reports';
import SettingsPage from './pages/settings';

// OPS subpages
import OrdersPage from './pages/ops/orders';
import InventoryPage from './pages/ops/inventory';
import BatchesPage from './pages/ops/batches';
import SalesPage from './pages/ops/sales';
import TaxPage from './pages/ops/tax';
import CompliancePage from './pages/ops/compliance';
import OpsReportsPage from './pages/ops/reports';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/connect',
    element: <ConnectPage />,
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
    path: '/ops/orders',
    element: <OrdersPage />,
  },
  {
    path: '/ops/inventory',
    element: <InventoryPage />,
  },
  {
    path: '/ops/batches',
    element: <BatchesPage />,
  },
  {
    path: '/ops/sales',
    element: <SalesPage />,
  },
  {
    path: '/ops/tax',
    element: <TaxPage />,
  },
  {
    path: '/ops/compliance',
    element: <CompliancePage />,
  },
  {
    path: '/ops/reports',
    element: <OpsReportsPage />,
  },
  {
    path: '/os',
    element: <OsPage />,
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
