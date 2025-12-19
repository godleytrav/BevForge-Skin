import { useState } from 'react';
import Dashboard from '@/layouts/Dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  Warehouse, 
  Factory, 
  Droplets,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'truck' | 'customer' | 'production' | 'cleaning';
  items: ProductGroup[];
  capacity?: number;
  capacityCases?: number;
}

interface ProductGroup {
  id: string;
  productName: string;
  containerType: 'keg' | 'case' | 'pallet';
  quantity: number;
  status?: 'normal' | 'warning' | 'error';
  palletId?: string;
}

export default function CanvasPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedItem, setSelectedItem] = useState<ProductGroup | null>(null);

  // Mock data - will be replaced with API calls
  const [locations] = useState<Location[]>([
    {
      id: 'warehouse-1',
      name: 'Main Warehouse',
      type: 'warehouse',
      items: [
        { id: 'p1', productName: 'Hopped Cider', containerType: 'keg', quantity: 24, status: 'normal' },
        { id: 'p2', productName: 'Dry Cider', containerType: 'case', quantity: 56, status: 'normal' },
        { id: 'p3', productName: 'Sweet Cider', containerType: 'case', quantity: 12, status: 'warning' },
      ],
    },
    {
      id: 'truck-1',
      name: 'Truck #3',
      type: 'truck',
      capacity: 1,
      capacityCases: 3,
      items: [
        { id: 'p4', productName: 'Hopped Cider', containerType: 'pallet', quantity: 1, status: 'normal', palletId: 'P-001' },
        { id: 'p5', productName: 'Dry Cider', containerType: 'case', quantity: 3, status: 'normal' },
      ],
    },
    {
      id: 'customer-1',
      name: 'Restaurant A',
      type: 'customer',
      items: [
        { id: 'p6', productName: 'Hopped Cider', containerType: 'keg', quantity: 4, status: 'error' },
        { id: 'p7', productName: 'Aged Cider', containerType: 'keg', quantity: 2, status: 'normal' },
      ],
    },
    {
      id: 'production-1',
      name: 'Production Floor',
      type: 'production',
      items: [
        { id: 'p8', productName: 'Hopped Cider', containerType: 'keg', quantity: 8, status: 'normal' },
      ],
    },
    {
      id: 'cleaning-1',
      name: 'Cleaning Station',
      type: 'cleaning',
      items: [
        { id: 'p9', productName: 'Empty Kegs', containerType: 'keg', quantity: 47, status: 'normal' },
      ],
    },
  ]);

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'warehouse':
        return <Warehouse className="h-5 w-5" />;
      case 'truck':
        return <Truck className="h-5 w-5" />;
      case 'customer':
        return <Package className="h-5 w-5" />;
      case 'production':
        return <Factory className="h-5 w-5" />;
      case 'cleaning':
        return <Droplets className="h-5 w-5" />;
    }
  };

  const getContainerIcon = (type: ProductGroup['containerType']) => {
    switch (type) {
      case 'keg':
        return '🛢️';
      case 'case':
        return '📦';
      case 'pallet':
        return '🏗️';
    }
  };

  const getStatusBadge = (status?: ProductGroup['status']) => {
    if (!status || status === 'normal') return null;
    
    return (
      <Badge variant={status === 'warning' ? 'outline' : 'destructive'} className="ml-2">
        {status === 'warning' ? <Clock className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
        {status === 'warning' ? 'Low' : 'Overdue'}
      </Badge>
    );
  };

  return (
    <Dashboard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Logistics Canvas</h1>
            <p className="text-muted-foreground mt-1">
              Visual container tracking and movement management
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              New Container
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Pallet
            </Button>
          </div>
        </div>

        {/* Alerts Bar */}
        <Card className="p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <p className="font-medium text-amber-900 dark:text-amber-100">3 Alerts Require Attention</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                4 kegs overdue at Restaurant A • Low inventory: Sweet Cider (12 cases) • Truck #3 at capacity
              </p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </Card>

        {/* Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Card
              key={location.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedLocation?.id === location.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              {/* Location Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getLocationIcon(location.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{location.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{location.type}</p>
                  </div>
                </div>
                {location.type === 'truck' && (
                  <Badge variant="secondary">
                    {location.items.filter(i => i.containerType === 'pallet').length}/{location.capacity} pallets
                  </Badge>
                )}
              </div>

              {/* Capacity Indicator for Trucks */}
              {location.type === 'truck' && location.capacity && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">
                      {location.items.filter(i => i.containerType === 'pallet').length}/{location.capacity} pallets, {' '}
                      {location.items.filter(i => i.containerType === 'case').reduce((sum, i) => sum + i.quantity, 0)}/{location.capacityCases} cases
                    </span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ 
                        width: `${Math.min(100, (location.items.filter(i => i.containerType === 'pallet').length / (location.capacity || 1)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Product Groups */}
              <div className="space-y-2">
                {location.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No items</p>
                ) : (
                  location.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border transition-all hover:bg-accent cursor-pointer ${
                        selectedItem?.id === item.id ? 'bg-accent border-primary' : 'bg-card'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getContainerIcon(item.containerType)}</span>
                          <div>
                            <p className="font-medium text-sm">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} {item.containerType}{item.quantity !== 1 ? 's' : ''}
                              {item.palletId && ` • ${item.palletId}`}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  View Details
                </Button>
                {location.type === 'truck' && (
                  <Button variant="ghost" size="sm" className="flex-1">
                    Start Route
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Detail Panel - Placeholder */}
        {selectedItem && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedItem.productName} - {selectedItem.quantity} {selectedItem.containerType}
                {selectedItem.quantity !== 1 ? 's' : ''}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Container Type</p>
                  <p className="font-medium capitalize">{selectedItem.containerType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{selectedItem.quantity}</p>
                </div>
                {selectedItem.palletId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Pallet ID</p>
                    <p className="font-medium">{selectedItem.palletId}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="font-medium">Available</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Package className="h-4 w-4 mr-2" />
                  Move
                </Button>
                <Button variant="outline" className="flex-1">
                  Print Label
                </Button>
                <Button variant="outline" className="flex-1">
                  View History
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Dashboard>
  );
}
