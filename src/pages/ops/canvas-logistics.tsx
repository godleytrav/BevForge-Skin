import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Beer,
  Wine,
  Package,
  Truck,
  AlertCircle,
  QrCode,
  Printer,
  Plus,
  CheckCircle,
  Clock,
  MapPin,
  RotateCcw,
} from 'lucide-react';

// Types
type ContainerType = 'keg' | 'case' | 'bottle' | 'can';
type ContainerStatus = 'pending' | 'approved' | 'staged' | 'loaded' | 'in-transit' | 'delivered' | 'returned';
type WorkflowStage = 'production' | 'packaging' | 'delivery' | 'tax' | 'restaurant' | 'returns';

interface Container {
  id: string;
  type: ContainerType;
  product: string;
  batchNumber: string;
  quantity: number;
  status: ContainerStatus;
  stage: WorkflowStage;
  qrCode?: string;
  orderId?: string;
  truckId?: string;
  restaurantId?: string;
}

interface Order {
  id: string;
  restaurantName: string;
  items: Container[];
  status: 'pending' | 'approved' | 'staged' | 'loaded' | 'delivered';
  createdAt: Date;
}

interface Truck {
  id: string;
  name: string;
  status: 'loading' | 'loaded' | 'in-transit' | 'delivered';
  containers: Container[];
  departureTime?: Date;
}

// Initial mock data
const initialContainers: Container[] = [
  {
    id: 'keg-001',
    type: 'keg',
    product: 'Hopped Cider',
    batchNumber: 'BATCH-2024-001',
    quantity: 12,
    status: 'pending',
    stage: 'production',
    qrCode: 'QR-KEG-001',
  },
  {
    id: 'case-001',
    type: 'case',
    product: 'Dry Cider',
    batchNumber: 'BATCH-2024-002',
    quantity: 24,
    status: 'pending',
    stage: 'packaging',
    qrCode: 'QR-CASE-001',
  },
];

const initialOrders: Order[] = [
  {
    id: 'order-001',
    restaurantName: 'The Craft House',
    items: [
      {
        id: 'keg-002',
        type: 'keg',
        product: 'Hopped Cider',
        batchNumber: 'BATCH-2024-001',
        quantity: 6,
        status: 'pending',
        stage: 'delivery',
        qrCode: 'QR-KEG-002',
        orderId: 'order-001',
      },
    ],
    status: 'pending',
    createdAt: new Date(),
  },
];

export default function CanvasLogistics() {
  const [containers] = useState<Container[]>(initialContainers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [trucks, setTrucks] = useState<Truck[]>([
    { id: 'truck-001', name: 'Truck #1', status: 'loading', containers: [] },
  ]);
  const [stagingArea, setStagingArea] = useState<Container[]>([]);
  const [selectedStage, setSelectedStage] = useState<WorkflowStage>('production');
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Container | null>(null);

  // Workflow stages in order
  const workflowStages: { id: WorkflowStage; label: string; icon: any; color: string }[] = [
    { id: 'production', label: 'Production', icon: Beer, color: 'bg-blue-500' },
    { id: 'packaging', label: 'Packaging', icon: Package, color: 'bg-purple-500' },
    { id: 'delivery', label: 'Delivery', icon: Truck, color: 'bg-orange-500' },
    { id: 'tax', label: 'Tax Determination', icon: AlertCircle, color: 'bg-yellow-500' },
    { id: 'restaurant', label: 'Restaurant', icon: MapPin, color: 'bg-green-500' },
    { id: 'returns', label: 'Keg Returns', icon: RotateCcw, color: 'bg-gray-500' },
  ];

  // Get icon for container type
  const getContainerIcon = (type: ContainerType) => {
    switch (type) {
      case 'keg':
        return Beer;
      case 'bottle':
        return Wine;
      case 'case':
      case 'can':
        return Package;
      default:
        return Package;
    }
  };

  // Get status color
  const getStatusColor = (status: ContainerStatus) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-500';
      case 'approved':
        return 'border-green-500';
      case 'staged':
        return 'border-blue-500';
      case 'loaded':
        return 'border-orange-500';
      case 'in-transit':
        return 'border-purple-500';
      case 'delivered':
        return 'border-emerald-500';
      case 'returned':
        return 'border-gray-500';
      default:
        return 'border-gray-300';
    }
  };

  // Drag handlers
  const handleDragStart = (container: Container) => {
    setDraggedItem(container);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToStaging = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && !stagingArea.find((c) => c.id === draggedItem.id)) {
      setStagingArea([...stagingArea, { ...draggedItem, status: 'staged' }]);
      setDraggedItem(null);
    }
  };

  const handleDropToTruck = (truckId: string) => {
    if (draggedItem) {
      setTrucks(
        trucks.map((truck) =>
          truck.id === truckId
            ? {
                ...truck,
                containers: [...truck.containers, { ...draggedItem, status: 'loaded', truckId }],
              }
            : truck
        )
      );
      setStagingArea(stagingArea.filter((c) => c.id !== draggedItem.id));
      setDraggedItem(null);
    }
  };

  // Approve order
  const approveOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setStagingArea([...stagingArea, ...order.items.map((item) => ({ ...item, status: 'approved' as ContainerStatus }))]);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'approved' } : o)));
    }
  };

  // Mark truck as on road (triggers tax determination)
  const markTruckOnRoad = (truckId: string) => {
    setTrucks(
      trucks.map((truck) =>
        truck.id === truckId
          ? {
              ...truck,
              status: 'in-transit',
              departureTime: new Date(),
              containers: truck.containers.map((c) => ({ ...c, status: 'in-transit', stage: 'tax' })),
            }
          : truck
      )
    );
    // Trigger tax determination
    alert('Tax determination triggered for truck departure from bonded facility (TTB requirement)');
  };

  // View container details
  const viewContainerDetails = (container: Container) => {
    setSelectedContainer(container);
    setDetailPanelOpen(true);
  };

  // Get containers by stage
  const getContainersByStage = (stage: WorkflowStage) => {
    return containers.filter((c) => c.stage === stage);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar - 30% */}
      <div className="h-[30%] border-b border-border p-4">
        {/* Power Tools Bar */}
        <div className="flex items-center gap-2 mb-4">
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Container
          </Button>
          <Button size="sm" variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Create Pallet
          </Button>
          <Button size="sm" variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Labels
          </Button>
          <Button size="sm" variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR
          </Button>
          <Button size="sm" variant="outline">
            <AlertCircle className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>

        {/* Linear Workflow Stages */}
        <div className="flex items-center gap-2 h-[calc(100%-60px)]">
          {workflowStages.map((stage, index) => {
            const Icon = stage.icon;
            const stageContainers = getContainersByStage(stage.id);
            const isSelected = selectedStage === stage.id;

            return (
              <div key={stage.id} className="flex items-center flex-1">
                <Card
                  className={`flex-1 h-full p-4 cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedStage(stage.id)}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <div className={`${stage.color} p-3 rounded-full text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-semibold text-center">{stage.label}</div>
                    <Badge variant="secondary">{stageContainers.length}</Badge>
                  </div>
                </Card>
                {index < workflowStages.length - 1 && (
                  <div className="w-8 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-border"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Area - 70% Split */}
      <div className="h-[70%] flex">
        {/* Left: Virtual Staging Area - 50% */}
        <div
          className="w-1/2 border-r border-border p-4 overflow-y-auto"
          onDragOver={handleDragOver}
          onDrop={handleDropToStaging}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Virtual Staging Area</h2>
            <Badge variant="outline">{stagingArea.length} items</Badge>
          </div>

          {/* Pending Orders */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Pending Orders</h3>
            {orders
              .filter((o) => o.status === 'pending')
              .map((order) => (
                <Card key={order.id} className="p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{order.restaurantName}</div>
                      <div className="text-xs text-muted-foreground">{order.id}</div>
                    </div>
                    <Button size="sm" onClick={() => approveOrder(order.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.items.length} items • {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                  </div>
                </Card>
              ))}
          </div>

          {/* Staged Items */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Ready to Load</h3>
            <div className="grid grid-cols-2 gap-2">
              {stagingArea.map((container) => {
                const Icon = getContainerIcon(container.type);
                return (
                  <Card
                    key={container.id}
                    className={`p-3 cursor-move border-2 ${getStatusColor(container.status)}`}
                    draggable
                    onDragStart={() => handleDragStart(container)}
                    onClick={() => viewContainerDetails(container)}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{container.product}</div>
                        <div className="text-xs text-muted-foreground">{container.quantity} units</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {container.batchNumber}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Info Bar with Tabs - 50% */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <Tabs defaultValue="trucks" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trucks">Trucks</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="stage-info">Stage Info</TabsTrigger>
            </TabsList>

            {/* Trucks Tab */}
            <TabsContent value="trucks" className="space-y-4">
              {trucks.map((truck) => (
                <Card key={truck.id} className="p-4" onDragOver={handleDragOver} onDrop={() => handleDropToTruck(truck.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">{truck.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {truck.status}
                        </Badge>
                      </div>
                    </div>
                    {truck.status === 'loaded' && (
                      <Button size="sm" onClick={() => markTruckOnRoad(truck.id)}>
                        <Clock className="h-4 w-4 mr-1" />
                        On Road
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {truck.containers.length} items loaded • {truck.containers.reduce((sum, c) => sum + c.quantity, 0)} units
                    </div>
                    {truck.containers.map((container) => {
                      const Icon = getContainerIcon(container.type);
                      return (
                        <div
                          key={container.id}
                          className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                          onClick={() => viewContainerDetails(container)}
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{container.product}</div>
                            <div className="text-xs text-muted-foreground">{container.quantity} units</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Restaurants Tab */}
            <TabsContent value="restaurants">
              <Card className="p-4">
                <div className="text-center text-muted-foreground py-8">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No deliveries yet</p>
                </div>
              </Card>
            </TabsContent>

            {/* Stage Info Tab */}
            <TabsContent value="stage-info">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">
                  {workflowStages.find((s) => s.id === selectedStage)?.label}
                </h3>
                <div className="space-y-2">
                  {getContainersByStage(selectedStage).map((container) => {
                    const Icon = getContainerIcon(container.type);
                    return (
                      <div
                        key={container.id}
                        className={`flex items-center gap-2 p-3 border-2 rounded cursor-pointer hover:bg-muted/50 ${getStatusColor(
                          container.status
                        )}`}
                        draggable
                        onDragStart={() => handleDragStart(container)}
                        onClick={() => viewContainerDetails(container)}
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">{container.product}</div>
                          <div className="text-sm text-muted-foreground">
                            {container.quantity} units • {container.batchNumber}
                          </div>
                        </div>
                        <Badge variant="outline">{container.status}</Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Detail Panel Slide-out */}
      <Sheet open={detailPanelOpen} onOpenChange={setDetailPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Container Details</SheetTitle>
          </SheetHeader>
          {selectedContainer && (
            <div className="mt-6 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Product</div>
                <div className="font-semibold">{selectedContainer.product}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Batch Number</div>
                <div className="font-mono">{selectedContainer.batchNumber}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Container ID</div>
                <div className="font-mono">{selectedContainer.id}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Quantity</div>
                <div>{selectedContainer.quantity} units</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge>{selectedContainer.status}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Stage</div>
                <Badge variant="outline">{selectedContainer.stage}</Badge>
              </div>
              {selectedContainer.qrCode && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">QR Code</div>
                  <div className="bg-muted p-4 rounded text-center">
                    <QrCode className="h-24 w-24 mx-auto" />
                    <div className="text-xs mt-2 font-mono">{selectedContainer.qrCode}</div>
                  </div>
                </div>
              )}
              <div className="pt-4 space-y-2">
                <Button className="w-full" variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Label
                </Button>
                <Button className="w-full" variant="outline">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
