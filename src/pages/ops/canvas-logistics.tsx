import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Printer,
  Package,
  Truck as TruckIcon,
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
import { ContainerDetailModal } from '@/components/canvas/ContainerDetailModal';
import {
  type Container,
  type Truck,
  type Location,
  createContainer,
  createTruck,
  createLocation,
  loadContainerOnTruck,
  startTruckRoute,
  updateContainerStatus,
  getTruckCapacityPercentage,
} from '@/lib/container-tracking';

// Initialize sample data with tracking IDs
const initializeContainers = (): Container[] => {
  const containers: Container[] = [];
  
  // Create kegs for Joe's Bar order
  for (let i = 0; i < 2; i++) {
    containers.push(
      createContainer('keg', 'IPA', 'BATCH-2024-001', {
        volume: '15.5 gal',
        weight: 160,
        orderId: 'ORD-001',
        customerId: "Joe's Bar",
        status: 'staging',
        location: 'Staging Area',
      })
    );
  }
  
  // Create case for Joe's Bar
  containers.push(
    createContainer('case', 'Bottles, 12-pack', 'BATCH-2024-002', {
      quantity: 12,
      weight: 30,
      orderId: 'ORD-001',
      customerId: "Joe's Bar",
      status: 'staging',
      location: 'Staging Area',
    })
  );
  
  // Create kegs for Main St Pub order
  for (let i = 0; i < 5; i++) {
    containers.push(
      createContainer('keg', 'Lager', 'BATCH-2024-003', {
        volume: '15.5 gal',
        weight: 160,
        orderId: 'ORD-002',
        customerId: 'Main St Pub',
        status: 'staging',
        location: 'Staging Area',
      })
    );
  }
  
  // Create kegs for Downtown Pub order
  for (let i = 0; i < 3; i++) {
    containers.push(
      createContainer('keg', 'Stout', 'BATCH-2024-004', {
        volume: '15.5 gal',
        weight: 160,
        orderId: 'ORD-003',
        customerId: 'Downtown Pub',
        status: 'staging',
        location: 'Staging Area',
      })
    );
  }
  
  // Create cases for Downtown Pub
  for (let i = 0; i < 2; i++) {
    containers.push(
      createContainer('case', 'Cans, 6-pack', 'BATCH-2024-005', {
        quantity: 6,
        weight: 15,
        orderId: 'ORD-003',
        customerId: 'Downtown Pub',
        status: 'staging',
        location: 'Staging Area',
      })
    );
  }
  
  return containers;
};

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
  { id: 'delivery', name: 'Delivery', icon: TruckIcon, color: 'bg-orange-500' },
  { id: 'tax', name: 'Tax Determination', icon: Shield, color: 'bg-purple-500' },
  { id: 'restaurant', name: 'Restaurant', icon: Home, color: 'bg-red-500' },
  { id: 'returns', name: 'Keg Returns', icon: RotateCcw, color: 'bg-gray-500' },
];

export default function CanvasLogistics() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedStage, setSelectedStage] = useState<string | null>('delivery');
  const [containers, setContainers] = useState<Container[]>(initializeContainers());
  const [trucks, setTrucks] = useState<Truck[]>([
    createTruck('TRUCK-1', 'Route A', 10000),
  ]);
  const [locations, setLocations] = useState<Location[]>([
    createLocation("Joe's Bar", 'restaurant', '123 Main St'),
    createLocation('Main St Pub', 'restaurant', '456 Oak Ave'),
    createLocation('Downtown Pub', 'restaurant', '789 Elm St'),
  ]);
  const [selectedDetail, setSelectedDetail] = useState<{
    container?: Container;
    truck?: Truck;
    location?: Location;
  } | null>(null);
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'case' | 'pallet' | null>(null);
  const { addNotification } = useNotifications();

  const handleApprove = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'approved' as const } : order
      )
    );
    
    // Update container statuses
    setContainers((prev) =>
      prev.map((container) =>
        container.orderId === orderId
          ? updateContainerStatus(container, 'staging', 'Staging Area', 'Order approved')
          : container
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
    
    const truck = trucks[0];
    const orderContainers = containers.filter((c) => c.orderId === order.id);
    
    // Load containers onto truck
    let updatedTruck = truck;
    const updatedContainers = containers.map((container) => {
      if (container.orderId === order.id) {
        updatedTruck = loadContainerOnTruck(updatedTruck, container);
        return updateContainerStatus(container, 'loaded', 'Truck', `Loaded on ${truck.name}`);
      }
      return container;
    });
    
    setTrucks([updatedTruck]);
    setContainers(updatedContainers);
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'loaded' as const } : o))
    );
    
    addNotification({
      title: 'Loaded to Truck',
      message: `${order.customer} order loaded to ${truck.name}`,
      type: 'success',
    });
  };

  const handleStartRoute = () => {
    const truck = trucks[0];
    if (truck.containers.length === 0) {
      addNotification({
        title: 'Cannot Start Route',
        message: 'No containers loaded on truck',
        type: 'error',
      });
      return;
    }
    
    const updatedTruck = startTruckRoute(truck);
    setTrucks([updatedTruck]);
    
    // Update container statuses
    setContainers((prev) =>
      prev.map((container) =>
        truck.containers.includes(container.id)
          ? updateContainerStatus(container, 'in-transit', 'On Road', 'Truck departed')
          : container
      )
    );
    
    addNotification({
      title: 'Route Started',
      message: 'Tax determination triggered (TTB requirement)',
      type: 'success',
    });
  };

  const handleContainerClick = (container: Container) => {
    setSelectedDetail({ container });
  };

  const handleTruckClick = (truck: Truck) => {
    setSelectedDetail({ truck });
  };

  const handleLocationClick = (location: Location) => {
    setSelectedDetail({ location });
  };

  // Automation functions
  const toggleContainerSelection = (containerId: string) => {
    setSelectedContainers((prev) =>
      prev.includes(containerId)
        ? prev.filter((id) => id !== containerId)
        : [...prev, containerId]
    );
  };

  const handleCreateCase = () => {
    if (selectedContainers.length < 12) {
      addNotification({
        title: 'Cannot Create Case',
        message: 'Select at least 12 bottles to create a case',
        type: 'error',
      });
      return;
    }

    const selectedItems = containers.filter((c) => selectedContainers.includes(c.id));
    const totalWeight = selectedItems.reduce((sum, c) => sum + c.weight, 0);
    const totalVolume = selectedItems.reduce((sum, c) => sum + c.volume, 0);

    const newCase = createContainer(
      `CASE-${String(containers.filter((c) => c.type === 'case').length + 1).padStart(4, '0')}`,
      'case',
      selectedItems[0].product,
      selectedItems[0].batchNumber,
      'staging',
      totalWeight,
      totalVolume
    );

    // Set parent-child relationships
    const updatedContainers = containers.map((c) =>
      selectedContainers.includes(c.id) ? { ...c, parentId: newCase.id } : c
    );

    setContainers([...updatedContainers, newCase]);
    setSelectedContainers([]);
    setSelectionMode(null);

    addNotification({
      title: 'Case Created',
      message: `Created ${newCase.id} with ${selectedContainers.length} bottles`,
      type: 'success',
    });
  };

  const handleCreatePallet = () => {
    if (selectedContainers.length === 0) {
      addNotification({
        title: 'Cannot Create Pallet',
        message: 'Select containers to add to pallet',
        type: 'error',
      });
      return;
    }

    const selectedItems = containers.filter((c) => selectedContainers.includes(c.id));
    const totalWeight = selectedItems.reduce((sum, c) => sum + c.weight, 0);
    const totalVolume = selectedItems.reduce((sum, c) => sum + c.volume, 0);

    const newPallet = createContainer(
      `PLT-${String(containers.filter((c) => c.type === 'pallet').length + 1).padStart(4, '0')}`,
      'pallet',
      'Mixed',
      'MIXED',
      'staging',
      totalWeight,
      totalVolume
    );

    // Set parent-child relationships
    const updatedContainers = containers.map((c) =>
      selectedContainers.includes(c.id) ? { ...c, parentId: newPallet.id } : c
    );

    setContainers([...updatedContainers, newPallet]);
    setSelectedContainers([]);
    setSelectionMode(null);

    addNotification({
      title: 'Pallet Created',
      message: `Created ${newPallet.id} with ${selectedContainers.length} containers (${totalWeight.toFixed(0)} lbs)`,
      type: 'success',
    });
  };

  const getStageInfo = () => {
    if (!selectedStage) return null;

    switch (selectedStage) {
      case 'production':
        return {
          title: 'Production',
          content: (
            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded">
                <h4 className="font-semibold mb-2">Active Batches</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>BATCH-2024-001 (IPA)</span>
                    <Badge variant="outline">Fermenting</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>BATCH-2024-002 (Lager)</span>
                    <Badge variant="outline">Conditioning</Badge>
                  </div>
                </div>
              </div>
            </div>
          ),
        };
      case 'packaging':
        return {
          title: 'Packaging',
          content: (
            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded">
                <h4 className="font-semibold mb-2">Today's Packaging</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Kegs Filled</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cases Packed</span>
                    <span className="font-semibold">48</span>
                  </div>
                </div>
              </div>
            </div>
          ),
        };
      case 'delivery':
        const truck = trucks[0];
        const capacity = getTruckCapacityPercentage(truck);
        return {
          title: 'Delivery',
          content: (
            <div className="space-y-3">
              <div 
                className="bg-orange-500/10 border border-orange-500/20 p-4 rounded cursor-pointer hover:bg-orange-500/20 transition-colors"
                onClick={() => handleTruckClick(truck)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{truck.name} - {truck.route}</h4>
                    <Badge variant="outline" className="mt-1">
                      {truck.status.toUpperCase().replace('-', ' ')}
                    </Badge>
                  </div>
                  <TruckIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Capacity</span>
                    <span className="font-semibold">{capacity}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${capacity}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Loaded Items</span>
                    <span className="font-semibold">{truck.containers.length}</span>
                  </div>
                </div>
                {truck.status === 'loading' && (
                  <Button
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartRoute();
                    }}
                  >
                    Start Route
                  </Button>
                )}
              </div>
            </div>
          ),
        };
      case 'tax':
        const bondedContainers = containers.filter((c) => c.status === 'staging' || c.status === 'production');
        return {
          title: 'Tax Determination',
          content: (
            <div className="space-y-3">
              <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded">
                <h4 className="font-semibold mb-2">Bonded Storage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Containers in Bond</span>
                    <span className="font-semibold">{bondedContainers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Liability</span>
                    <span className="font-semibold text-purple-600">$0.00</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Tax triggered when product leaves bonded facility (TTB requirement)
                </p>
              </div>
            </div>
          ),
        };
      case 'restaurant':
        return {
          title: 'Restaurant',
          content: (
            <div className="space-y-3">
              {locations.map((location) => {
                const locationContainers = containers.filter((c) =>
                  location.containers.includes(c.id)
                );
                return (
                  <div
                    key={location.id}
                    className="bg-red-500/10 border border-red-500/20 p-4 rounded cursor-pointer hover:bg-red-500/20 transition-colors"
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{location.name}</h4>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                      </div>
                      <Home className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Kegs On-Site</span>
                      <span className="font-semibold">{locationContainers.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ),
        };
      case 'returns':
        return {
          title: 'Keg Returns',
          content: (
            <div className="space-y-3">
              <div className="bg-gray-500/10 border border-gray-500/20 p-4 rounded">
                <h4 className="font-semibold mb-2">Empty Containers</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Awaiting Pickup</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Transit</span>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </div>
            </div>
          ),
        };
      default:
        return null;
    }
  };

  const stageInfo = getStageInfo();
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const approvedOrders = orders.filter((o) => o.status === 'approved');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top 30% - Workflow Tiles */}
      <div className="h-[30%] bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Logistics Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Container
            </Button>
            <Button
              variant={selectionMode === 'case' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectionMode(selectionMode === 'case' ? null : 'case')}
            >
              <Package className="h-4 w-4 mr-2" />
              Create Case {selectionMode === 'case' && `(${selectedContainers.length}/12)`}
            </Button>
            <Button
              variant={selectionMode === 'pallet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectionMode(selectionMode === 'pallet' ? null : 'pallet')}
            >
              <Package className="h-4 w-4 mr-2" />
              Create Pallet {selectionMode === 'pallet' && `(${selectedContainers.length})`}
            </Button>
            {selectedContainers.length > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={selectionMode === 'case' ? handleCreateCase : handleCreatePallet}
              >
                Confirm {selectionMode === 'case' ? 'Case' : 'Pallet'}
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Labels
            </Button>
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>

        {/* Linear Workflow */}
        <div className="grid grid-cols-6 gap-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isSelected = selectedStage === stage.id;
            const stageContainers = containers.filter((c) => {
              if (stage.id === 'production') return c.status === 'production';
              if (stage.id === 'packaging') return c.status === 'packaging';
              if (stage.id === 'delivery') return c.status === 'loaded' || c.status === 'in-transit';
              if (stage.id === 'tax') return c.status === 'staging';
              if (stage.id === 'restaurant') return c.status === 'delivered';
              if (stage.id === 'returns') return c.status === 'returned';
              return false;
            });

            return (
              <Card
                key={stage.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-lg scale-105'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedStage(stage.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`${stage.color} p-3 rounded-full text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{stage.name}</p>
                      <p className="text-2xl font-bold">{stageContainers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom 70% - Split View */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden bg-background">
        {/* Left 50% - Virtual Staging Area */}
        <div className="w-1/2 flex flex-col gap-4 overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-foreground">Virtual Staging Area</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {/* Pending Orders */}
              {pendingOrders.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                    Pending Orders
                  </h3>
                  <div className="space-y-3">
                    {pendingOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-yellow-500/20 bg-yellow-500/10 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{order.customer}</h4>
                            <p className="text-sm text-muted-foreground">{order.id}</p>
                          </div>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            {order.status}
                          </Badge>
                        </div>
                        <ul className="space-y-1 mb-3">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-sm flex items-center gap-2">
                              {item.type === 'Keg' ? (
                                <Beer className="h-4 w-4 text-amber-600" />
                              ) : (
                                <Wine className="h-4 w-4 text-purple-600" />
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
                    ))}
                  </div>
                </div>
              )}

              {/* Ready to Load */}
              {approvedOrders.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                    Ready to Load
                  </h3>
                  <div className="space-y-3">
                    {approvedOrders.map((order) => {
                      const orderContainers = containers.filter(
                        (c) => c.orderId === order.id
                      );
                      return (
                        <div
                          key={order.id}
                          className="border-2 border-green-500/20 bg-green-500/10 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{order.customer}</h4>
                              <p className="text-sm text-muted-foreground">{order.id}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              {order.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 mb-3">
                            {orderContainers.map((container) => (
                              <div
                                key={container.id}
                                className="text-sm flex items-center justify-between bg-card border border-border p-2 rounded cursor-pointer hover:bg-muted transition-colors"
                                onClick={(e) => {
                                  if (selectionMode) {
                                    e.stopPropagation();
                                    toggleContainerSelection(container.id);
                                  } else {
                                    handleContainerClick(container);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {selectionMode && (
                                    <input
                                      type="checkbox"
                                      checked={selectedContainers.includes(container.id)}
                                      onChange={() => toggleContainerSelection(container.id)}
                                      className="h-4 w-4"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  )}
                                  {container.type === 'keg' ? (
                                    <Beer className="h-4 w-4 text-amber-600" />
                                  ) : (
                                    <Wine className="h-4 w-4 text-purple-600" />
                                  )}
                                  <span className="font-mono text-xs">{container.id}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {container.productName}
                                </span>
                              </div>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleLoadToTruck(order)}
                          >
                            Load to Truck
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 50% - Stage Info */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-foreground">{stageInfo?.title || 'Select a Stage'}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {stageInfo ? (
                stageInfo.content
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Click on a workflow stage above to view details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <ContainerDetailModal
          container={selectedDetail.container}
          truck={selectedDetail.truck}
          location={selectedDetail.location}
          allContainers={containers}
          onClose={() => setSelectedDetail(null)}
          onPrint={() => {
            addNotification({
              title: 'Print Initiated',
              message: 'Printing tracking label...',
              type: 'success',
            });
          }}
        />
      )}
    </div>
  );
}
