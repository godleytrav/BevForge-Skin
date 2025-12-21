import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { validateContainerMove, formatValidationMessage } from '@/lib/validation';
import { getAllAlerts, getAlertColor, getAlertIcon, type Alert } from '@/lib/alerts';
import { CreatePalletDialog } from '@/components/canvas/CreatePalletDialog';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Plus,
  Package,
  Truck,
  AlertCircle,
  Beer,
  Wine,
  GripVertical,
  Printer,
  Bell,
  AlertTriangle,
  Home,
  Factory,
  RotateCcw,
  Shield,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Types
interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'truck' | 'customer' | 'production' | 'cleaning' | 'tax';
  capacity?: number;
  products: ProductGroup[];
  containers: Container[];
}

interface ProductGroup {
  productId: string;
  productName: string;
  containerType: 'keg' | 'case' | 'bottle' | 'can';
  quantity: number;
  containers: Container[];
}

interface Container {
  id: string;
  productId: string;
  productName: string;
  batchId: string;
  type: 'keg' | 'case' | 'bottle' | 'can';
  status: 'pending' | 'approved' | 'loaded' | 'in-transit' | 'delivered' | 'returned';
  locationId: string;
  palletId?: string;
}

// Lifecycle stages configuration
const stages = [
  { id: 'tax', name: 'Tax Determination', icon: Shield, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500', angle: 0 },
  { id: 'production', name: 'Production House', icon: Factory, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500', angle: 60 },
  { id: 'packaging', name: 'Packaging', icon: Package, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500', angle: 120 },
  { id: 'delivery', name: 'Delivery', icon: Truck, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500', angle: 180 },
  { id: 'restaurant', name: 'Restaurant', icon: Home, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500', angle: 240 },
  { id: 'returns', name: 'Returns/Empties', icon: RotateCcw, color: 'text-gray-500', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500', angle: 300 },
];

// Mock initial data
const initialLocations: Location[] = [
  {
    id: 'tax-zone',
    name: 'Bonded Storage',
    type: 'tax',
    containers: [],
    products: [
      {
        productId: 'PROD-001',
        productName: 'Hopped Cider',
        containerType: 'keg',
        quantity: 12,
        containers: Array.from({ length: 12 }, (_, i) => ({
          id: `KEG-${1000 + i}`,
          productId: 'PROD-001',
          productName: 'Hopped Cider',
          batchId: 'B-2024-045',
          type: 'keg' as const,
          status: 'pending' as const,
          locationId: 'tax-zone',
        })),
      },
      {
        productId: 'PROD-002',
        productName: 'Dry Cider',
        containerType: 'case',
        quantity: 24,
        containers: Array.from({ length: 24 }, (_, i) => ({
          id: `CASE-${2000 + i}`,
          productId: 'PROD-002',
          productName: 'Dry Cider',
          batchId: 'B-2024-046',
          type: 'case' as const,
          status: 'pending' as const,
          locationId: 'tax-zone',
        })),
      },
    ],
  },
  {
    id: 'production-floor',
    name: 'Production Floor',
    type: 'production',
    products: [],
    containers: [],
  },
  {
    id: 'packaging-area',
    name: 'Packaging Station',
    type: 'warehouse',
    products: [],
    containers: [],
  },
  {
    id: 'truck-1',
    name: 'Truck #1',
    type: 'truck',
    capacity: 50,
    products: [],
    containers: [],
  },
  {
    id: 'restaurant-a',
    name: "Joe's Bar",
    type: 'customer',
    products: [],
    containers: [],
  },
  {
    id: 'returns-area',
    name: 'Returns Processing',
    type: 'cleaning',
    products: [],
    containers: [],
  },
];

export default function CanvasLogistics() {
  const { addNotification } = useNotifications();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: 'container' | 'product' | 'location';
    data: any;
  } | null>(null);
  const [draggedItem, setDraggedItem] = useState<{
    containerId: string;
    productName: string;
    containerType: string;
    fromLocationId: string;
  } | null>(null);
  const [showAddContainer, setShowAddContainer] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [newContainer, setNewContainer] = useState({
    productName: '',
    type: 'keg' as Container['type'],
    quantity: 1,
    locationId: '',
    batchId: 'B-001',
  });

  // Compute alerts whenever locations change
  useEffect(() => {
    const allContainers = locations.flatMap((loc) => loc.products.flatMap(p => p.containers));
    const computedAlerts = getAllAlerts(locations, allContainers);
    setAlerts(computedAlerts);
  }, [locations]);

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (containerId: string, productName: string, containerType: string, fromLocationId: string) => {
      setDraggedItem({ containerId, productName, containerType, fromLocationId });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDrop = useCallback(
    (toLocationId: string) => {
      if (!draggedItem) return;

      const fromLocation = locations.find((l) => l.id === draggedItem.fromLocationId);
      const toLocation = locations.find((l) => l.id === toLocationId);
      
      if (!fromLocation || !toLocation) return;

      const container = fromLocation.products
        .find(
          (p) =>
            p.productName === draggedItem.productName &&
            p.containerType === draggedItem.containerType
        )
        ?.containers.find((c) => c.id === draggedItem.containerId);

      if (!container) return;

      // Validate the move
      const validation = validateContainerMove(
        {
          id: container.id,
          product: container.productName,
          type: container.type,
          status: container.status,
          batchId: container.batchId,
        } as any,
        {
          id: fromLocation.id,
          name: fromLocation.name,
          type: fromLocation.type,
          capacity: fromLocation.capacity,
          containers: fromLocation.products.flatMap((p) => p.containers) as any,
        },
        {
          id: toLocation.id,
          name: toLocation.name,
          type: toLocation.type,
          capacity: toLocation.capacity,
          containers: toLocation.products.flatMap((p) => p.containers) as any,
        }
      );

      if (!validation.valid) {
        addNotification({
          title: 'Move Blocked',
          description: formatValidationMessage(validation),
          time: 'Just now',
          type: 'system',
          icon: 'alert-circle',
        });
        setDraggedItem(null);
        return;
      }

      if (validation.warnings.length > 0) {
        addNotification({
          title: 'Warning',
          description: formatValidationMessage(validation),
          time: 'Just now',
          type: 'system',
          icon: 'alert-triangle',
        });
      }

      // Update locations state
      setLocations((prevLocations) => {
        const newLocations = prevLocations.map((loc) => {
          // Remove from source
          if (loc.id === draggedItem.fromLocationId) {
            return {
              ...loc,
              products: loc.products.map((prod) => {
                if (
                  prod.productName === draggedItem.productName &&
                  prod.containerType === draggedItem.containerType
                ) {
                  return {
                    ...prod,
                    quantity: prod.quantity - 1,
                    containers: prod.containers.filter(
                      (c) => c.id !== draggedItem.containerId
                    ),
                  };
                }
                return prod;
              }).filter((prod) => prod.quantity > 0),
            };
          }

          // Add to destination
          if (loc.id === toLocationId) {
            const existingProduct = loc.products.find(
              (p) =>
                p.productName === draggedItem.productName &&
                p.containerType === draggedItem.containerType
            );

            const updatedContainer = { ...container, locationId: toLocationId };

            if (existingProduct) {
              return {
                ...loc,
                products: loc.products.map((prod) =>
                  prod.productName === draggedItem.productName &&
                  prod.containerType === draggedItem.containerType
                    ? {
                        ...prod,
                        quantity: prod.quantity + 1,
                        containers: [...prod.containers, updatedContainer],
                      }
                    : prod
                ),
              };
            } else {
              return {
                ...loc,
                products: [
                  ...loc.products,
                  {
                    productId: container.productId,
                    productName: container.productName,
                    containerType: container.type,
                    quantity: 1,
                    containers: [updatedContainer],
                  },
                ],
              };
            }
          }

          return loc;
        });

        return newLocations;
      });

      addNotification({
        title: 'Container Moved',
        description: `${container.productName} moved to ${toLocation.name}`,
        time: 'Just now',
        type: 'inventory',
        icon: 'package',
      });

      setDraggedItem(null);
    },
    [draggedItem, locations, addNotification]
  );

  const handleAddContainer = () => {
    if (!newContainer.locationId) return;

    const containers: Container[] = [];
    for (let i = 0; i < newContainer.quantity; i++) {
      containers.push({
        id: `${newContainer.type.toUpperCase()}-${Date.now()}-${i}`,
        productId: `PROD-${Date.now()}`,
        productName: newContainer.productName,
        batchId: newContainer.batchId,
        type: newContainer.type,
        status: 'pending',
        locationId: newContainer.locationId,
      });
    }

    setLocations(
      locations.map((loc) => {
        if (loc.id === newContainer.locationId) {
          const existingProduct = loc.products.find(
            (p) =>
              p.productName === newContainer.productName &&
              p.containerType === newContainer.type
          );

          if (existingProduct) {
            return {
              ...loc,
              products: loc.products.map((p) =>
                p.productName === newContainer.productName &&
                p.containerType === newContainer.type
                  ? {
                      ...p,
                      quantity: p.quantity + newContainer.quantity,
                      containers: [...p.containers, ...containers],
                    }
                  : p
              ),
            };
          } else {
            return {
              ...loc,
              products: [
                ...loc.products,
                {
                  productId: `PROD-${Date.now()}`,
                  productName: newContainer.productName,
                  containerType: newContainer.type,
                  quantity: newContainer.quantity,
                  containers,
                },
              ],
            };
          }
        }
        return loc;
      })
    );

    setShowAddContainer(false);
    setNewContainer({
      productName: '',
      type: 'keg',
      quantity: 1,
      locationId: '',
      batchId: 'B-001',
    });
  };

  const getContainerIcon = (type: Container['type']) => {
    switch (type) {
      case 'keg':
        return <Beer className="h-4 w-4" />;
      case 'case':
        return <Package className="h-4 w-4" />;
      case 'bottle':
        return <Wine className="h-4 w-4" />;
      case 'can':
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Container['status']) => {
    switch (status) {
      case 'pending':
        return 'border-l-yellow-500';
      case 'approved':
        return 'border-l-green-500';
      case 'loaded':
        return 'border-l-blue-500';
      case 'in-transit':
        return 'border-l-orange-500';
      case 'delivered':
        return 'border-l-purple-500';
      case 'returned':
        return 'border-l-gray-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const getStageLocation = (stageId: string): Location | undefined => {
    return locations.find(loc => {
      if (stageId === 'tax' && loc.type === 'tax') return true;
      if (stageId === 'production' && loc.type === 'production') return true;
      if (stageId === 'packaging' && loc.name.includes('Packaging')) return true;
      if (stageId === 'delivery' && loc.type === 'truck') return true;
      if (stageId === 'restaurant' && loc.type === 'customer') return true;
      if (stageId === 'returns' && loc.type === 'cleaning') return true;
      return false;
    });
  };

  // Calculate positions for circular layout
  const radius = 220;
  const centerX = 300;
  const centerY = 300;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Alert Bar */}
      {alerts.length > 0 && (
        <div className="border-b bg-destructive/10 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">
              {alerts.length} Active Alert{alerts.length > 1 ? 's' : ''}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              View All
            </Button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Logistics Canvas</h2>
            <Badge variant="secondary">
              {locations.reduce((sum, loc) => sum + loc.products.reduce((s, p) => s + p.quantity, 0), 0)} Containers
            </Badge>
            {alerts.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <Bell className="h-3 w-3" />
                {alerts.length}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Dialog open={showAddContainer} onOpenChange={setShowAddContainer}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Containers
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Containers</DialogTitle>
                  <DialogDescription>
                    Add kegs, cases, bottles, or cans to a location
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      placeholder="e.g., Hopped Cider, Dry Cider"
                      value={newContainer.productName}
                      onChange={(e) =>
                        setNewContainer({
                          ...newContainer,
                          productName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="container-type">Container Type</Label>
                    <Select
                      value={newContainer.type}
                      onValueChange={(value: Container['type']) =>
                        setNewContainer({ ...newContainer, type: value })
                      }
                    >
                      <SelectTrigger id="container-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keg">Keg</SelectItem>
                        <SelectItem value="case">Case</SelectItem>
                        <SelectItem value="bottle">Bottle</SelectItem>
                        <SelectItem value="can">Can (6-pack)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newContainer.quantity}
                      onChange={(e) =>
                        setNewContainer({
                          ...newContainer,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={newContainer.locationId}
                      onValueChange={(value) =>
                        setNewContainer({ ...newContainer, locationId: value })
                      }
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddContainer(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddContainer}
                    disabled={
                      !newContainer.productName || !newContainer.locationId
                    }
                  >
                    Add Containers
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <CreatePalletDialog
              onCreatePallet={(data) => {
                addNotification({
                  title: 'Pallet Created',
                  description: `${data.name} created successfully`,
                  time: 'Just now',
                  type: 'production',
                  icon: 'package',
                });
              }}
            />
            <Button size="sm" variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Labels
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - 50/50 Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Circular Lifecycle (50%) */}
        <div className="flex-1 relative border-r">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative" style={{ width: '600px', height: '600px' }}>
              {/* SVG for circular connections */}
              <svg
                className="absolute inset-0 pointer-events-none"
                style={{ width: '600px', height: '600px' }}
              >
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  opacity="0.5"
                />
                {stages.map((stage, idx) => {
                  const nextStage = stages[(idx + 1) % stages.length];
                  const x1 = centerX + radius * Math.cos((stage.angle * Math.PI) / 180);
                  const y1 = centerY + radius * Math.sin((stage.angle * Math.PI) / 180);
                  const x2 = centerX + radius * Math.cos((nextStage.angle * Math.PI) / 180);
                  const y2 = centerY + radius * Math.sin((nextStage.angle * Math.PI) / 180);
                  
                  return (
                    <line
                      key={`line-${stage.id}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      opacity="0.3"
                    />
                  );
                })}
              </svg>

              {/* Stage nodes */}
              {stages.map(stage => {
                const x = centerX + radius * Math.cos((stage.angle * Math.PI) / 180);
                const y = centerY + radius * Math.sin((stage.angle * Math.PI) / 180);
                const Icon = stage.icon;
                const isSelected = selectedStage === stage.id;
                const location = getStageLocation(stage.id);
                const itemCount = location?.products.reduce((sum, p) => sum + p.quantity, 0) || 0;

                return (
                  <button
                    key={stage.id}
                    onClick={() => {
                      setSelectedStage(stage.id === selectedStage ? null : stage.id);
                      if (location) {
                        setSelectedItem({ type: 'location', data: location });
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('ring-2', 'ring-primary');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('ring-2', 'ring-primary');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('ring-2', 'ring-primary');
                      if (location) {
                        handleDrop(location.id);
                      }
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isSelected ? 'scale-110 z-10' : 'hover:scale-105'
                    }`}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                    }}
                  >
                    <div
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl bg-card border-2 transition-all ${
                        isSelected
                          ? `${stage.borderColor} shadow-lg`
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ width: '120px' }}
                    >
                      {isSelected && (
                        <div className={`absolute inset-0 rounded-xl ${stage.bgColor} animate-pulse`} />
                      )}
                      
                      <div
                        className={`relative z-10 p-3 rounded-full bg-background border-2 ${
                          isSelected ? stage.borderColor : 'border-border'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${stage.color}`} />
                      </div>
                      <span className="relative z-10 text-xs font-medium text-center leading-tight">
                        {stage.name}
                      </span>
                      {itemCount > 0 && (
                        <Badge variant="secondary" className="relative z-10 text-xs">
                          {itemCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Info Box (50%) */}
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl h-[600px] border-2 shadow-xl">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span>
                  {selectedItem?.type === 'location' 
                    ? selectedItem.data.name 
                    : selectedStage 
                    ? stages.find(s => s.id === selectedStage)?.name 
                    : 'Select a Stage'}
                </span>
                {selectedItem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(null);
                      setSelectedStage(null);
                    }}
                  >
                    ×
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-6">
                  {!selectedItem && !selectedStage ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                      <Package className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Stage Selected</h3>
                      <p className="text-sm text-muted-foreground">
                        Click on a lifecycle stage to view details and manage containers
                      </p>
                    </div>
                  ) : selectedItem?.type === 'location' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{selectedItem.data.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {selectedItem.data.type}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {selectedItem.data.products.reduce((sum: number, p: ProductGroup) => sum + p.quantity, 0)} items
                        </Badge>
                      </div>

                      {selectedItem.data.products.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                          <p className="text-sm text-muted-foreground">No containers in this location</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedItem.data.products.map((product: ProductGroup) => (
                            <Card key={`${product.productId}-${product.containerType}`} className="border-l-4 border-l-primary">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    {getContainerIcon(product.containerType)}
                                    <div>
                                      <p className="font-medium">{product.productName}</p>
                                      <p className="text-xs text-muted-foreground capitalize">
                                        {product.containerType}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge>{product.quantity}</Badge>
                                </div>
                                <div className="space-y-2">
                                  {product.containers.slice(0, 3).map((container: Container) => (
                                    <div
                                      key={container.id}
                                      draggable
                                      onDragStart={() =>
                                        handleDragStart(
                                          container.id,
                                          container.productName,
                                          container.type,
                                          container.locationId
                                        )
                                      }
                                      onDragEnd={handleDragEnd}
                                      className={`flex items-center justify-between p-2 rounded border-l-4 ${getStatusColor(container.status)} bg-card hover:bg-accent cursor-move transition-colors`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="text-sm font-mono">{container.id}</p>
                                          <p className="text-xs text-muted-foreground">
                                            Batch: {container.batchId}
                                          </p>
                                        </div>
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        {container.status}
                                      </Badge>
                                    </div>
                                  ))}
                                  {product.quantity > 3 && (
                                    <p className="text-xs text-muted-foreground text-center">
                                      +{product.quantity - 3} more containers
                                    </p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts Dialog */}
      {showAlerts && (
        <Dialog open={showAlerts} onOpenChange={setShowAlerts}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                System Alerts
              </DialogTitle>
              <DialogDescription>
                {alerts.length} active alert{alerts.length > 1 ? 's' : ''} requiring attention
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-3 p-4">
                {alerts.map((alert) => (
                  <Card key={alert.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge className={getAlertColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        {alert.productName && (
                          <Badge variant="outline" className="text-xs mt-2">
                            {alert.productName}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
