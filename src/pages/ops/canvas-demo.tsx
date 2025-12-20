import { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Package,
  Truck,
  Warehouse,
  Factory,
  Store,
  RotateCcw,
  FileCheck,
  Bell,
  AlertCircle,
  Printer,
  CheckCircle,
} from 'lucide-react';

// Types
interface StageItem {
  id: string;
  orderId: string;
  customer: string;
  items: string[];
  status: 'pending' | 'approved' | 'loaded' | 'in-route' | 'delivered';
  dueDate: string;
}

interface Stage {
  id: string;
  name: string;
  icon: any;
  color: string;
  position: { x: number; y: number };
  items: StageItem[];
}

export default function CanvasDemoPage() {
  const { addNotification } = useNotifications();
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [stagingItems, setStagingItems] = useState<StageItem[]>([
    {
      id: 'item-1',
      orderId: 'ORD-123',
      customer: "Joe's Bar",
      items: ['2x Keg (IPA)', '1x Case (Bottles, 12-pack)'],
      status: 'pending',
      dueDate: '2025-12-20',
    },
    {
      id: 'item-2',
      orderId: 'ORD-124',
      customer: 'Main St Pub',
      items: ['5x Keg (Lager)'],
      status: 'pending',
      dueDate: '2025-12-20',
    },
    {
      id: 'item-3',
      orderId: 'ORD-125',
      customer: 'Downtown Pub',
      items: ['3x Keg (Stout)', '2x Case (Cans, 6-pack)'],
      status: 'pending',
      dueDate: '2025-12-21',
    },
  ]);

  const [stages, setStages] = useState<Stage[]>([
    {
      id: 'tax',
      name: 'Tax Determination',
      icon: FileCheck,
      color: 'bg-purple-500',
      position: { x: 50, y: 5 },
      items: [],
    },
    {
      id: 'production',
      name: 'Production House',
      icon: Factory,
      color: 'bg-blue-500',
      position: { x: 80, y: 25 },
      items: [],
    },
    {
      id: 'packaging',
      name: 'Packaging',
      icon: Package,
      color: 'bg-green-500',
      position: { x: 90, y: 55 },
      items: [],
    },
    {
      id: 'delivery',
      name: 'Delivery',
      icon: Truck,
      color: 'bg-orange-500',
      position: { x: 70, y: 85 },
      items: [],
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      icon: Store,
      color: 'bg-red-500',
      position: { x: 30, y: 85 },
      items: [],
    },
    {
      id: 'returns',
      name: 'Returns/Empties',
      icon: RotateCcw,
      color: 'bg-gray-500',
      position: { x: 10, y: 55 },
      items: [],
    },
  ]);

  const [trucks, setTrucks] = useState([
    {
      id: 'TRUCK-1',
      name: 'Truck #1 - Route A',
      capacity: 20,
      loaded: [] as StageItem[],
    },
  ]);

  const handleApprove = (itemId: string) => {
    setStagingItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: 'approved' as const } : item
      )
    );
    addNotification({
      title: 'Order Approved',
      message: `Order ${stagingItems.find((i) => i.id === itemId)?.orderId} approved for loading`,
      type: 'success',
    });
  };

  const handleLoadToTruck = (itemId: string) => {
    const item = stagingItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.status !== 'approved') {
      addNotification({
        title: 'Cannot Load',
        message: 'Order must be approved before loading',
        type: 'error',
      });
      return;
    }

    setStagingItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: 'loaded' as const } : i))
    );

    setTrucks((prev) =>
      prev.map((truck) =>
        truck.id === 'TRUCK-1'
          ? { ...truck, loaded: [...truck.loaded, { ...item, status: 'loaded' as const }] }
          : truck
      )
    );

    addNotification({
      title: 'Loaded to Truck',
      message: `Order ${item.orderId} loaded to Truck #1`,
      type: 'success',
    });
  };

  const handleStageClick = (stage: Stage) => {
    if (stage.id === 'delivery') {
      setSelectedStage({
        ...stage,
        items: trucks[0].loaded,
      });
    } else {
      setSelectedStage(stage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'loaded':
        return 'bg-blue-500';
      case 'in-route':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logistics Canvas - Circular Lifecycle</h1>
            <p className="text-sm text-muted-foreground">
              Staging area with circular workflow visualization
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
              <Badge variant="destructive" className="ml-2">
                3
              </Badge>
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Labels
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          {/* Circular Lifecycle Container */}
          <div className="relative w-full h-full">
            {/* Lifecycle Stages - Positioned in Circle */}
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageClick(stage)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${stage.color} hover:opacity-80 transition-all duration-200 rounded-full p-6 shadow-lg hover:shadow-xl hover:scale-110`}
                  style={{
                    left: `${stage.position.x}%`,
                    top: `${stage.position.y}%`,
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="h-8 w-8 text-white" />
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      {stage.name}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Center Staging Area */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
              <Card className="w-full h-full border-2 border-primary shadow-2xl">
                <div className="h-full flex flex-col">
                  {/* Staging Header */}
                  <div className="border-b bg-primary/5 p-4">
                    <h2 className="text-xl font-bold text-foreground">Staging Area</h2>
                    <p className="text-sm text-muted-foreground">
                      Approve and load orders for delivery
                    </p>
                  </div>

                  {/* Staging Items */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {stagingItems.map((item) => (
                        <Card
                          key={item.id}
                          className="p-4 border-l-4"
                          style={{
                            borderLeftColor:
                              item.status === 'pending'
                                ? '#eab308'
                                : item.status === 'approved'
                                ? '#22c55e'
                                : '#3b82f6',
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-foreground">
                                  {item.orderId}
                                </span>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.customer}</p>
                              <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                            </div>
                          </div>

                          <div className="space-y-1 mb-3">
                            {item.items.map((product, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-foreground flex items-center gap-2"
                              >
                                <Package className="h-3 w-3 text-muted-foreground" />
                                {product}
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            {item.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleApprove(item.id)}
                                className="flex-1"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            )}
                            {item.status === 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => handleLoadToTruck(item.id)}
                                className="flex-1"
                                variant="default"
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Load to Truck
                              </Button>
                            )}
                            {item.status === 'loaded' && (
                              <Badge variant="secondary" className="flex-1 justify-center py-2">
                                Loaded on Truck #1
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </Card>
            </div>

            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--muted-foreground))" opacity="0.3" />
                </marker>
              </defs>
              {/* Draw lines connecting stages in circular flow */}
              <line
                x1="50%"
                y1="5%"
                x2="80%"
                y2="25%"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
                markerEnd="url(#arrowhead)"
              />
              <line
                x1="80%"
                y1="25%"
                x2="90%"
                y2="55%"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
                markerEnd="url(#arrowhead)"
              />
              <line
                x1="90%"
                y1="55%"
                x2="70%"
                y2="85%"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
                markerEnd="url(#arrowhead)"
              />
              <line
                x1="70%"
                y1="85%"
                x2="30%"
                y2="85%"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
                markerEnd="url(#arrowhead)"
              />
              <line
                x1="30%"
                y1="85%"
                x2="10%"
                y2="55%"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
                markerEnd="url(#arrowhead)"
              />
              <line
                x1="10%"
                y1="55%"
                x2="50%"
                y2="5%"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stage Detail Panel */}
      {selectedStage && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg animate-in slide-in-from-bottom duration-300">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = selectedStage.icon;
                  return <Icon className="h-6 w-6 text-primary" />;
                })()}
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedStage.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedStage.id === 'delivery'
                      ? `${trucks[0].loaded.length} items loaded on ${trucks[0].name}`
                      : 'Stage details and inventory'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStage(null)}>
                Close
              </Button>
            </div>

            {selectedStage.id === 'delivery' ? (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{trucks[0].name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Capacity: {trucks[0].loaded.length}/{trucks[0].capacity} items
                    </p>
                  </div>
                  <Button variant="default">
                    <Truck className="h-4 w-4 mr-2" />
                    Start Route
                  </Button>
                </div>

                <div className="space-y-3">
                  {trucks[0].loaded.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No items loaded yet. Approve and load items from staging area.
                    </p>
                  ) : (
                    trucks[0].loaded.map((item, idx) => (
                      <Card key={item.id} className="p-3 bg-muted/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-foreground">
                                Stop {idx + 1}: {item.customer}
                              </span>
                              <Badge variant="secondary">{item.orderId}</Badge>
                            </div>
                            <div className="space-y-1">
                              {item.items.map((product, pidx) => (
                                <div
                                  key={pidx}
                                  className="text-xs text-muted-foreground flex items-center gap-2"
                                >
                                  <Package className="h-3 w-3" />
                                  {product}
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Printer className="h-3 w-3 mr-1" />
                            Label
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  {selectedStage.name} stage details will be shown here. This includes inventory,
                  status updates, and stage-specific actions.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
