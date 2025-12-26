# BevForge OS Module - Implementation Guide

## Overview

The OS (Operating System) module is the source of truth for inventory, batches, and production tracking in BevForge. It uses a unified navigation system (AppShell) that provides seamless switching between all BevForge suites.

## Architecture

### Unified Navigation System

All BevForge suites (OS, OPS, Lab, Connect, Flow) share the same navigation shell for a consistent user experience.

**Key Component:** `src/components/AppShell.tsx`

#### Features:
- **Suite Selector**: Dropdown to switch between OS, OPS, Lab, Connect, Flow
- **Top Navigation Bar**: Horizontal navigation with suite-specific menu items
- **User Profile Menu**: User info, settings, notifications
- **Mobile Responsive**: Collapsible menu for mobile devices
- **Active Route Highlighting**: Visual indication of current page

#### Usage Pattern:

```tsx
import AppShell, { NavigationItem } from '@/components/AppShell';
import { Home, Package, Beaker } from 'lucide-react';

const osNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/os', icon: Home },
  { name: 'Inventory', href: '/os/inventory', icon: Package },
  { name: 'Batches', href: '/os/batches', icon: Beaker },
];

export default function OSPage() {
  return (
    <AppShell
      currentSuite="os"
      navigation={osNavigation}
      userName="Travis Godley"
      userEmail="travis@bevforge.com"
    >
      {/* Page content here */}
    </AppShell>
  );
}
```

## OS Module Structure

### Routes

All OS routes are prefixed with `/os`:

- `/os` - Dashboard (overview)
- `/os/inventory` - Inventory management
- `/os/batches` - Production batch tracking
- `/os/materials` - Raw materials catalog
- `/os/locations` - Warehouse locations
- `/os/movements` - Inventory movement history

**File:** `src/routes.tsx`

### Navigation Items

OS navigation is defined in each page:

```tsx
const osNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/os', icon: Home },
  { name: 'Inventory', href: '/os/inventory', icon: Package },
  { name: 'Batches', href: '/os/batches', icon: Beaker },
  { name: 'Materials', href: '/os/materials', icon: Box },
  { name: 'Locations', href: '/os/locations', icon: MapPin },
  { name: 'Movements', href: '/os/movements', icon: Truck },
];
```

## Styling Guidelines

### CSS Variables

OS uses the same CSS variables as all other suites for consistency.

**File:** `src/styles/globals.css`

#### Core Colors (Light Theme):

```css
--background: 0 0% 100%;           /* White background */
--foreground: 222.2 84% 4.9%;      /* Dark text */
--primary: 222.2 47.4% 11.2%;      /* Primary brand color */
--secondary: 210 40% 96.1%;        /* Secondary backgrounds */
--muted: 210 40% 96.1%;            /* Muted backgrounds */
--border: 214.3 31.8% 91.4%;       /* Border color */
--destructive: 0 84.2% 60.2%;      /* Error/danger color */
```

### Using Semantic Colors

**✅ ALWAYS use semantic color classes:**

```tsx
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">
<Card className="bg-card border-border">
```

**❌ NEVER hard-code colors:**

```tsx
<div className="bg-blue-500">  // Wrong!
<div className="text-gray-900"> // Wrong!
```

**Exception:** Status indicators can use specific colors:

```tsx
// Acceptable for status indicators
<div className="bg-green-500">  // Operational status
<div className="bg-yellow-500"> // Warning status
<div className="bg-red-500">    // Error status
```

## UI Components

### Available Components

All shadcn UI components are pre-installed in `src/components/ui/`:

- **Button** - All button variants
- **Card** - Content containers
- **Table** - Data tables
- **Dialog** - Modals
- **Input** - Form inputs
- **Select** - Dropdowns
- **Badge** - Status indicators
- **Tabs** - Tab navigation
- **DropdownMenu** - Dropdown menus

### Custom OS Components

#### DeviceCanvas

**File:** `src/components/DeviceCanvas.tsx`

Interactive canvas for visualizing production devices with drag-and-drop.

**Features:**
- Drag-and-drop device positioning
- Grid snapping
- Zoom controls
- Connection lines between devices
- Status indicators (operational, warning, error, offline)

**Usage:**

```tsx
import DeviceCanvas, { Device } from '@/components/DeviceCanvas';

const devices: Device[] = [
  {
    id: 'dev-1',
    type: 'TANK',
    name: 'Tank-01',
    x: 100,
    y: 100,
    status: 'operational',
    connections: ['dev-2'],
  },
];

<DeviceCanvas
  devices={devices}
  onDeviceMove={(id, x, y) => console.log('Moved', id, x, y)}
  onDeviceClick={(device) => console.log('Clicked', device)}
  className="h-[600px]"
/>
```

#### InventoryTable

**File:** `src/components/InventoryTable.tsx`

Data table for displaying inventory items with stock levels and trends.

**Features:**
- Stock status badges (In Stock, Low Stock, Out of Stock)
- Trend indicators (up, down, stable)
- Reorder point tracking
- Sortable columns

**Usage:**

```tsx
import InventoryTable, { InventoryItem } from '@/components/InventoryTable';

const items: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Malt Extract',
    category: 'Raw Materials',
    quantity: 450,
    unit: 'kg',
    reorderPoint: 200,
    lastUpdated: '2 hours ago',
    trend: 'down',
  },
];

<InventoryTable
  items={items}
  onItemClick={(item) => console.log('Clicked', item)}
/>
```

#### MetricCard

**File:** `src/components/MetricCard.tsx`

Display key metrics with status indicators and change percentages.

**Usage:**

```tsx
import MetricCard from '@/components/MetricCard';
import { Package } from 'lucide-react';

<MetricCard
  title="Inventory Items"
  value={125}
  unit="items"
  icon={Package}
  status="operational"
  change={{ value: 5, label: 'from last week' }}
/>
```

## Page Layout Pattern

### Standard OS Page Structure

```tsx
import AppShell, { NavigationItem } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Package } from 'lucide-react';

const osNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/os', icon: Home },
  { name: 'Inventory', href: '/os/inventory', icon: Package },
];

export default function OSInventoryPage() {
  return (
    <AppShell
      currentSuite="os"
      navigation={osNavigation}
      userName="Travis Godley"
      userEmail="travis@bevforge.com"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your inventory and stock levels
          </p>
        </div>

        {/* Page Content */}
        <Card>
          <CardHeader>
            <CardTitle>Current Stock</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content here */}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
```

## Database Schema (Future)

### Required Tables

When implementing the backend, these tables will be needed:

**File:** `src/server/db/schema.ts`

```typescript
import { mysqlTable, varchar, decimal, timestamp, int } from 'drizzle-orm/mysql-core';

// Items (products, materials, packaging)
export const items = mysqlTable('items', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'finished_good', 'raw_material', 'packaging'
  unit: varchar('unit', { length: 20 }).notNull(), // 'L', 'kg', 'units'
  createdAt: timestamp('created_at').defaultNow(),
});

// Inventory Ledger (canonical source of truth)
export const inventoryLedger = mysqlTable('inventory_ledger', {
  id: varchar('id', { length: 50 }).primaryKey(),
  itemId: varchar('item_id', { length: 50 }).notNull(),
  locationId: varchar('location_id', { length: 50 }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  movementType: varchar('movement_type', { length: 50 }).notNull(), // 'in', 'out', 'transfer'
  timestamp: timestamp('timestamp').defaultNow(),
});

// Locations (warehouse bins/locations)
export const locations = mysqlTable('locations', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'warehouse', 'production', 'shipping'
});

// Batches (production runs)
export const batches = mysqlTable('batches', {
  id: varchar('id', { length: 50 }).primaryKey(),
  itemId: varchar('item_id', { length: 50 }).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'planned', 'in_progress', 'completed'
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
});
```

## API Endpoints (Future)

### Required Endpoints

When implementing the backend API:

**File:** `src/server/api/os/`

```
GET  /api/os/items                    # All products/materials
GET  /api/os/inventory/on-hand        # Current stock levels
GET  /api/os/batches                  # Production batches
GET  /api/os/inventory/movements      # Movement history
POST /api/os/inventory/movements      # Record new movement
GET  /api/os/locations                # Warehouse locations
```

## Development Workflow

### Adding a New OS Page

1. **Create the page component** in `src/pages/os/`
2. **Import AppShell** and define navigation
3. **Add route** to `src/routes.tsx`
4. **Use semantic colors** from CSS variables
5. **Follow the standard layout pattern**

### Example: Adding Batches Page

```tsx
// src/pages/os/batches.tsx
import AppShell, { NavigationItem } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Package, Beaker } from 'lucide-react';

const osNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/os', icon: Home },
  { name: 'Inventory', href: '/os/inventory', icon: Package },
  { name: 'Batches', href: '/os/batches', icon: Beaker },
];

export default function OSBatchesPage() {
  return (
    <AppShell
      currentSuite="os"
      navigation={osNavigation}
      userName="Travis Godley"
      userEmail="travis@bevforge.com"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batches</h1>
          <p className="text-muted-foreground">
            Track production batches and outputs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Batch list here */}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
```

Then add to routes:

```tsx
// src/routes.tsx
import OSBatchesPage from './pages/os/batches';

export const routes: RouteObject[] = [
  // ...
  {
    path: '/os/batches',
    element: <OSBatchesPage />,
  },
];
```

## Testing Checklist

Before considering a page complete:

- [ ] Uses AppShell with `currentSuite="os"`
- [ ] Navigation switches between OS/OPS/Lab work correctly
- [ ] All colors use CSS variables (no hard-coded colors)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Active route is highlighted in navigation
- [ ] Page header follows standard pattern
- [ ] TypeScript compiles without errors
- [ ] Components use shadcn UI library

## Key Files Reference

### Navigation & Layout
- `src/components/AppShell.tsx` - Unified navigation shell
- `src/routes.tsx` - Route definitions
- `src/App.tsx` - App setup

### Styling
- `src/styles/globals.css` - CSS variables and theme
- `tailwind.config.js` - Tailwind configuration

### UI Components
- `src/components/ui/*` - All shadcn components
- `src/components/DeviceCanvas.tsx` - Device visualization
- `src/components/InventoryTable.tsx` - Inventory data table
- `src/components/MetricCard.tsx` - Metric display cards

### Pages
- `src/pages/index.tsx` - OS Dashboard (main page)

## Summary

The OS module is built with:

✅ **Unified AppShell navigation** - Seamless suite switching
✅ **Semantic CSS variables** - Consistent styling across suites
✅ **shadcn UI components** - Professional, accessible UI
✅ **Standard layout patterns** - Predictable page structure
✅ **Mobile responsive** - Works on all screen sizes
✅ **TypeScript** - Type-safe development

The result: OS looks and feels like part of the same unified BevForge platform, with seamless navigation between all suites.
