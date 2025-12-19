import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Warehouse,
  Truck,
  Building2,
  Beaker,
  Droplets,
  AlertTriangle,
  Package,
  Info,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
  productId: string;
  productName: string;
  productType: string;
  containerCount: number;
  totalVolume: number;
}

interface Pallet {
  id: string;
  name: string;
  status: string;
  containerCount: number;
}

interface Location {
  id: string;
  name: string;
  type: string;
  capacity: number | null;
  products: Product[];
  pallets: Pallet[];
}

interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
}

export default function CanvasPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [locationsRes, alertsRes] = await Promise.all([
        fetch('/api/canvas/locations'),
        fetch('/api/canvas/alerts'),
      ]);

      if (locationsRes.ok) {
        const locationsData = await locationsRes.json();
        setLocations(locationsData.locations || []);
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.alerts || []);
      }
    } catch (error) {
      console.error('Error fetching canvas data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'warehouse':
        return <Warehouse className="h-5 w-5" />;
      case 'truck':
        return <Truck className="h-5 w-5" />;
      case 'customer':
        return <Building2 className="h-5 w-5" />;
      case 'production':
        return <Beaker className="h-5 w-5" />;
      case 'cleaning':
        return <Droplets className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'error':
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const locationsByType = locations.reduce((acc, location) => {
    if (!acc[location.type]) {
      acc[location.type] = [];
    }
    acc[location.type].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'error');

  if (loading) {
    return (
      <AppShell pageTitle="Logistics Canvas">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading canvas data...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell pageTitle="Logistics Canvas">
      <div className="space-y-6">
        {/* Alert Bar */}
        {criticalAlerts.length > 0 && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-red-500">
                    {criticalAlerts.length} Critical Alert{criticalAlerts.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1">
                    {criticalAlerts.slice(0, 3).map((alert) => (
                      <p key={alert.id} className="text-sm text-muted-foreground">
                        • {alert.message}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Warehouse & Production */}
          <div className="space-y-6">
            {/* Warehouse Locations */}
            {locationsByType.warehouse?.map((location) => (
              <Card key={location.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getLocationIcon(location.type)}
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </div>
                    {location.capacity && (
                      <Badge variant="outline" className="text-xs">
                        Cap: {location.capacity}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {location.products.length > 0 ? (
                    <div className="space-y-2">
                      {location.products.map((product) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
                          onClick={() => setSelectedItem({ type: 'product', location, product })}
                        >
                          <div>
                            <p className="text-sm font-medium">{product.productName}</p>
                            <p className="text-xs text-muted-foreground">{product.productType}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{product.containerCount}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.totalVolume.toFixed(1)}L
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Empty</p>
                  )}
                  {location.pallets.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Pallets</p>
                        {location.pallets.map((pallet) => (
                          <div
                            key={pallet.id}
                            className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedItem({ type: 'pallet', location, pallet })}
                          >
                            <span>{pallet.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {pallet.containerCount} items
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Production Locations */}
            {locationsByType.production?.map((location) => (
              <Card key={location.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {getLocationIcon(location.type)}
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {location.products.length > 0 ? (
                    <div className="space-y-2">
                      {location.products.map((product) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between p-2 rounded bg-muted/50"
                        >
                          <div>
                            <p className="text-sm font-medium">{product.productName}</p>
                            <p className="text-xs text-muted-foreground">{product.productType}</p>
                          </div>
                          <p className="text-sm font-bold">{product.containerCount}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Empty</p>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Cleaning Locations */}
            {locationsByType.cleaning?.map((location) => (
              <Card key={location.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {getLocationIcon(location.type)}
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {location.products.length > 0 ? (
                    <div className="space-y-2">
                      {location.products.map((product) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between p-2 rounded bg-muted/50"
                        >
                          <p className="text-sm font-medium">{product.productName}</p>
                          <p className="text-sm font-bold">{product.containerCount}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Empty</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Middle Column - Trucks */}
          <div className="space-y-6">
            {locationsByType.truck?.map((location) => (
              <Card
                key={location.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-blue-500/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getLocationIcon(location.type)}
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </div>
                    {location.capacity && (
                      <Badge variant="outline" className="text-xs">
                        {location.products.reduce((sum, p) => sum + p.containerCount, 0)} /{' '}
                        {location.capacity}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {location.products.length > 0 ? (
                    <div className="space-y-2">
                      {location.products.map((product) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between p-2 rounded bg-muted/50"
                        >
                          <div>
                            <p className="text-sm font-medium">{product.productName}</p>
                            <p className="text-xs text-muted-foreground">{product.productType}</p>
                          </div>
                          <p className="text-sm font-bold">{product.containerCount}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Empty</p>
                  )}
                  {location.pallets.length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Pallets</p>
                        {location.pallets.map((pallet) => (
                          <div
                            key={pallet.id}
                            className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-muted/50 transition-colors"
                          >
                            <span>{pallet.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {pallet.containerCount} items
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            {(!locationsByType.truck || locationsByType.truck.length === 0) && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No trucks configured</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Add Truck
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Customers */}
          <div className="space-y-6">
            {locationsByType.customer?.map((location) => (
              <Card key={location.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {getLocationIcon(location.type)}
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {location.products.length > 0 ? (
                    <div className="space-y-2">
                      {location.products.map((product) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between p-2 rounded bg-muted/50"
                        >
                          <div>
                            <p className="text-sm font-medium">{product.productName}</p>
                            <p className="text-xs text-muted-foreground">{product.productType}</p>
                          </div>
                          <p className="text-sm font-bold">{product.containerCount}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No inventory</p>
                  )}
                </CardContent>
              </Card>
            ))}

            {(!locationsByType.customer || locationsByType.customer.length === 0) && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No customer locations</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <Card className="fixed bottom-4 right-4 w-96 shadow-2xl z-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <CardTitle className="text-base">
                    {selectedItem.type === 'product' ? 'Product Details' : 'Pallet Details'}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedItem.type === 'product' ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Product</p>
                    <p className="font-semibold">{selectedItem.product.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm">{selectedItem.product.productType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm">{selectedItem.location.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Containers</p>
                      <p className="text-lg font-bold">{selectedItem.product.containerCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Volume</p>
                      <p className="text-lg font-bold">
                        {selectedItem.product.totalVolume.toFixed(1)}L
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Move
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Pallet</p>
                    <p className="font-semibold">{selectedItem.pallet.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant={getStatusColor(selectedItem.pallet.status)}>
                      {selectedItem.pallet.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm">{selectedItem.location.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Containers</p>
                    <p className="text-lg font-bold">{selectedItem.pallet.containerCount}</p>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Load
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Contents
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
