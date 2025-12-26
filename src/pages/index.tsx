import { useState } from 'react';
import AppShell, { NavigationItem } from '@/components/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricCard from '@/components/MetricCard';
import DeviceCanvas, { Device } from '@/components/DeviceCanvas';
import InventoryTable, { InventoryItem } from '@/components/InventoryTable';
import {
  Home,
  Package,
  Beaker,
  Box,
  MapPin,
  Truck,
  Activity,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

// OS Navigation
const osNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/os', icon: Home },
  { name: 'Inventory', href: '/os/inventory', icon: Package },
  { name: 'Batches', href: '/os/batches', icon: Beaker },
  { name: 'Materials', href: '/os/materials', icon: Box },
  { name: 'Locations', href: '/os/locations', icon: MapPin },
  { name: 'Movements', href: '/os/movements', icon: Truck },
];

// Mock data for demonstration
const initialDevices: Device[] = [
  {
    id: 'dev-1',
    type: 'TANK',
    name: 'Tank-01',
    x: 100,
    y: 100,
    status: 'operational',
    connections: ['dev-2'],
  },
  {
    id: 'dev-2',
    type: 'PUMP',
    name: 'Pump-A',
    x: 300,
    y: 100,
    status: 'operational',
    connections: ['dev-3'],
  },
  {
    id: 'dev-3',
    type: 'VALVE',
    name: 'Valve-01',
    x: 500,
    y: 100,
    status: 'warning',
  },
  {
    id: 'dev-4',
    type: 'SENSOR',
    name: 'Temp-01',
    x: 100,
    y: 300,
    status: 'operational',
  },
  {
    id: 'dev-5',
    type: 'TANK',
    name: 'Tank-02',
    x: 300,
    y: 300,
    status: 'error',
  },
];

const inventoryItems: InventoryItem[] = [
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
  {
    id: 'inv-2',
    name: 'Hops - Cascade',
    category: 'Raw Materials',
    quantity: 85,
    unit: 'kg',
    reorderPoint: 50,
    lastUpdated: '5 hours ago',
    trend: 'stable',
  },
  {
    id: 'inv-3',
    name: 'Yeast - Ale',
    category: 'Raw Materials',
    quantity: 25,
    unit: 'kg',
    reorderPoint: 30,
    lastUpdated: '1 day ago',
    trend: 'down',
  },
  {
    id: 'inv-4',
    name: 'Bottles - 500ml',
    category: 'Packaging',
    quantity: 12500,
    unit: 'units',
    reorderPoint: 5000,
    lastUpdated: '3 hours ago',
    trend: 'up',
  },
  {
    id: 'inv-5',
    name: 'Labels',
    category: 'Packaging',
    quantity: 0,
    unit: 'units',
    reorderPoint: 2000,
    lastUpdated: '6 hours ago',
    trend: 'down',
  },
];

export default function HomePage() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  const handleDeviceMove = (deviceId: string, x: number, y: number) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, x, y } : device))
    );
  };

  const handleDeviceClick = (device: Device) => {
    console.log('Device clicked:', device);
  };

  const handleInventoryClick = (item: InventoryItem) => {
    console.log('Inventory item clicked:', item);
  };

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
          <h1 className="text-3xl font-bold text-foreground">OS Dashboard</h1>
          <p className="text-muted-foreground">
            Operating System - Inventory, Batches & Production Tracking
          </p>
        </div>

        {/* System Status Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">System Operational</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="text-xs text-muted-foreground font-mono">
                  Uptime: 47d 12h 34m
                </span>
                <div className="h-4 w-px bg-border" />
                <span className="text-xs text-muted-foreground font-mono">
                  Last Sync: 2 minutes ago
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-muted-foreground">3 warnings require attention</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Devices"
            value={devices.length}
            unit="devices"
            icon={Activity}
            status="operational"
            change={{ value: 5, label: 'from last week' }}
          />
          <MetricCard
            title="Inventory Items"
            value={inventoryItems.length}
            unit="items"
            icon={Package}
            status="info"
            change={{ value: -2, label: 'from last week' }}
          />
          <MetricCard
            title="System Warnings"
            value={3}
            unit="alerts"
            icon={AlertTriangle}
            status="warning"
          />
          <MetricCard
            title="Production Rate"
            value="94.2"
            unit="%"
            icon={TrendingUp}
            status="operational"
            change={{ value: 3.2, label: 'from last month' }}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="devices">Device Canvas</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            <DeviceCanvas
              devices={devices}
              onDeviceMove={handleDeviceMove}
              onDeviceClick={handleDeviceClick}
              className="h-[600px]"
            />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryTable items={inventoryItems} onItemClick={handleInventoryClick} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
