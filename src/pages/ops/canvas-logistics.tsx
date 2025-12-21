import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Printer,
  Package,
  Truck,
  Home,
  Factory,
  RotateCcw,
  Shield,
  Plus,
  QrCode,
  Beer,
  Wine,
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    customer: "Joe's Bar",
    items: [
      { type: 'Keg', product: 'IPA', quantity: 2 },
      { type: 'Case', product: 'Bottles, 12-pack', quantity: 1 },
    ],
    status: 'pending' as const,
  },
  {
    id: 'ORD-002',
    customer: 'Main St Pub',
    items: [{ type: 'Keg', product: 'Lager', quantity: 5 }],
    status: 'pending' as const,
  },
  {
    id: 'ORD-003',
    customer: 'Downtown Pub',
    items: [
      { type: 'Keg', product: 'Stout', quantity: 3 },
      { type: 'Case', product: 'Cans, 6-pack', quantity: 2 },
    ],
    status: 'pending' as const,
  },
];

// Workflow stages
const stages = [
  { id: 'production', name: 'Production', icon: Factory, color: 'bg-blue-500' },
  { id: 'packaging', name: 'Packaging', icon: Package, color: 'bg-green-500' },
  { id: 'delivery', name: 'Delivery', icon: Truck, color: 'bg-orange-500' },
  { id: 'tax', name: 'Tax Determination', icon: Shield, color: 'bg-purple-500' },
  { id: 'restaurant', name: 'Restaurant', icon: Home, color: 'bg-red-500' },
  { id: 'returns', name: 'Keg Returns', icon: RotateCcw, color: 'bg-gray-500' },
];

export default function CanvasLogistics() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedStage, setSelectedStage] = useState<string | null>('delivery');
  const [truckLoad, setTruckLoad] = useState<typeof mockOrders>([]);
  const { addNotification } = useNotifications();

  const handleApprove = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'approved' as const } : order
      )
    );
    addNotification({
      title: 'Order Approved',
      message: `Order ${orderId} has been approved for loading`,
      type: 'success',
    });
  };

  const handleLoadToTruck = (order: typeof mockOrders[0]) => {
    if (order.status !== 'approved') {
      addNotification({
        title: 'Cannot Load',
        message: 'Order must be approved before loading',
        type: 'error',
      });
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'loaded' as const } : o))
    );
    setTruckLoad((prev) => [...prev, { ...order, status: 'loaded' as const }]);
    addNotification({
      title: 'Loaded to Truck',
      message: `${order.customer} order loaded to TRUCK-1`,
      type: 'success',
    });
  };

  const handleStartRoute = () => {
    if (truckLoad.length === 0) {
      addNotification({
        title: 'Cannot Start Route',
        message: 'No items loaded on truck',
        type: 'error',
      });
      return;
    }
    addNotification({
      title: 'Route Started',
      message: 'TRUCK-1 is now on the road. Tax determination triggered.',
      type: 'success',
    });
  };

  // Get content for selected stage
  const getStageContent = (stageId: string) => {
    switch (stageId) {
      case 'production':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Active production batches</p>
            <div className="space-y-1">
              <div className="text-sm">Batch #2024-045 - IPA (Fermenting)</div>
              <div className="text-sm">Batch #2024-046 - Lager (Conditioning)</div>
              <div className="text-sm">Batch #2024-047 - Stout (Packaging)</div>
            </div>
          </div>
        );
      case 'packaging':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Packaging operations</p>
            <div className="space-y-1">
              <div className="text-sm">Kegs filled today: 45</div>
              <div className="text-sm">Bottles packaged: 1,200</div>
              <div className="text-sm">Cans packaged: 2,400</div>
            </div>
          </div>
        );
      case 'delivery':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">TRUCK-1 - Route A</h4>
              <Badge variant="outline">Capacity: 75%</Badge>
            </div>
            {truckLoad.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items loaded yet</p>
            ) : (
              <div className="space-y-2">
                {truckLoad.map((order, idx) => (
                  <div key={order.id} className="border-l-2 border-primary pl-3 py-1">
                    <div className="text-sm font-medium">
                      Stop {idx + 1}: {order.customer}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.items.map((item) => `${item.quantity}x ${item.type} (${item.product})`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button size="sm" className="w-full" onClick={handleStartRoute}>
              Start Route
            </Button>
          </div>
        );
      case 'tax':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Bonded storage tracking for TTB compliance
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Current Inventory:</span>
                <span className="font-medium">2,450 units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax Liability:</span>
                <span className="font-medium text-orange-500">$12,450.00</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Tax determination triggers when product leaves bonded facility
              </div>
            </div>
          </div>
        );
      case 'restaurant':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Active customer locations</p>
            <div className="space-y-1">
              <div className="text-sm">Joe's Bar - 12 kegs on-site</div>
              <div className="text-sm">Main St Pub - 8 kegs on-site</div>
              <div className="text-sm">Downtown Pub - 15 kegs on-site</div>
            </div>
          </div>
        );
      case 'returns':
        return (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Empty containers awaiting pickup</p>
            <div className="space-y-1">
              <div className="text-sm">Kegs to collect: 23</div>
              <div className="text-sm">Cases to collect: 8</div>
              <div className="text-sm">Next pickup: Tomorrow 9:00 AM</div>
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-muted-foreground">Select a stage to view details</p>;
    }
  };

  const selectedStageData = stages.find((s) => s.id === selectedStage);

  // Count items in each stage
  const getStageCounts = () => {
    return {
      production: 3,
      packaging: 45,
      delivery: truckLoad.length,
      tax: 2450,
      restaurant: 35,
      returns: 31,
    };
  };

  const stageCounts = getStageCounts();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top 30% - Linear Workflow Tiles */}
      <div className="h-[30vh] border-b bg-card">
        <div className="h-full flex flex-col">
          {/* Header with tools */}
          <div className="border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground">Logistics Canvas</h1>
                <p className="text-xs text-muted-foreground">Production to Delivery Workflow</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Container
                </Button>
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-1" />
                  QR Code
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-1" />
                  Alerts
                </Button>
              </div>
            </div>
          </div>

          {/* Linear workflow tiles */}
          <div className="flex-1 flex items-center justify-center gap-4 px-6">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.id;
              const count = stageCounts[stage.id as keyof typeof stageCounts];

              return (
                <div key={stage.id} className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedStage(stage.id)}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg scale-105'
                        : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">{stage.name}</div>
                      <div className="text-xs text-muted-foreground">{count}</div>
                    </div>
                  </button>
                  {idx < stages.length - 1 && (
                    <div className="w-8 h-0.5 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom 70% - Split View */}
      <div className="flex-1 flex">
        {/* Left 50% - Virtual Staging Area */}
        <div className="w-1/2 border-r p-6 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Staging Area</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pending Orders */}
              {orders
                .filter((order) => order.status === 'pending')
                .map((order) => (
                  <Card key={order.id} className="border-yellow-500">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{order.customer}</h4>
                          <Badge variant="outline" className="text-yellow-600">
                            {order.id}
                          </Badge>
                        </div>
                        <Badge variant="secondary">{order.status}</Badge>
                        <ul className="space-y-1 text-sm">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              {item.type === 'Keg' ? (
                                <Beer className="h-4 w-4" />
                              ) : (
                                <Wine className="h-4 w-4" />
                              )}
                              <span>
                                {item.quantity}x {item.type} ({item.product})
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleApprove(order.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* Approved Orders - Ready to Load */}
              {orders
                .filter((order) => order.status === 'approved')
                .map((order) => (
                  <Card key={order.id} className="border-green-500">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{order.customer}</h4>
                          <Badge variant="outline" className="text-green-600">
                            {order.id}
                          </Badge>
                        </div>
                        <Badge className="bg-green-500">Ready to Load</Badge>
                        <ul className="space-y-1 text-sm">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              {item.type === 'Keg' ? (
                                <Beer className="h-4 w-4" />
                              ) : (
                                <Wine className="h-4 w-4" />
                              )}
                              <span>
                                {item.quantity}x {item.type} ({item.product})
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleLoadToTruck(order)}
                        >
                          Load to Truck
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {orders.filter((o) => o.status === 'pending' || o.status === 'approved')
                .length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending orders</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 50% - Info Box */}
        <div className="w-1/2 p-6 overflow-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedStageData && (
                  <>
                    <div
                      className={`w-8 h-8 rounded-full ${selectedStageData.color} flex items-center justify-center text-white`}
                    >
                      <selectedStageData.icon className="h-4 w-4" />
                    </div>
                    {selectedStageData.name}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStage ? (
                getStageContent(selectedStage)
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click a stage above to view details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
