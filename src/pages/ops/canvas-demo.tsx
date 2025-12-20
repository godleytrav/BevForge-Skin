import { useState } from 'react';
import { Package, Truck, Home, Factory, RotateCcw, FileCheck, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StagedItem {
  id: string;
  type: 'keg' | 'case' | 'pallet';
  product: string;
  quantity: number;
  orderId?: string;
  customer?: string;
  status: 'pending' | 'approved' | 'loaded';
}

interface TruckLoad {
  truckId: string;
  items: StagedItem[];
  status: 'loaded' | 'in-route' | 'delivered';
  stops: Array<{
    customer: string;
    time: string;
    items: string[];
  }>;
}

export default function CanvasDemo() {
  const [stagedItems, setStagedItems] = useState<StagedItem[]>([
    {
      id: 'item-1',
      type: 'keg',
      product: 'IPA',
      quantity: 2,
      orderId: 'ORD-123',
      customer: "Joe's Bar",
      status: 'pending',
    },
    {
      id: 'item-2',
      type: 'case',
      product: 'Lager Bottles (12-pack)',
      quantity: 1,
      orderId: 'ORD-123',
      customer: "Joe's Bar",
      status: 'pending',
    },
    {
      id: 'item-3',
      type: 'keg',
      product: 'Lager',
      quantity: 5,
      orderId: 'ORD-124',
      customer: 'Main St Pub',
      status: 'approved',
    },
  ]);

  const [trucks, setTrucks] = useState<TruckLoad[]>([
    {
      truckId: 'TRUCK-1',
      items: [],
      status: 'loaded',
      stops: [
        { customer: "Joe's Bar", time: '10:00 AM', items: [] },
        { customer: 'Downtown Pub', time: '11:00 AM', items: [] },
      ],
    },
  ]);

  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const stages = [
    { id: 'tax', name: 'Tax Determination', icon: FileCheck, color: 'bg-purple-500', position: 'top' },
    { id: 'production', name: 'Production House', icon: Factory, color: 'bg-blue-500', position: 'top-right' },
    { id: 'packaging', name: 'Packaging', icon: Package, color: 'bg-green-500', position: 'right' },
    { id: 'delivery', name: 'Delivery', icon: Truck, color: 'bg-orange-500', position: 'bottom-right' },
    { id: 'restaurant', name: 'Restaurant', icon: Home, color: 'bg-red-500', position: 'bottom' },
    { id: 'returns', name: 'Returns/Empties', icon: RotateCcw, color: 'bg-gray-500', position: 'bottom-left' },
  ];

  const getPositionClass = (position: string) => {
    const positions: Record<string, string> = {
      top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'top-right': 'top-[10%] right-[10%]',
      right: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
      'bottom-right': 'bottom-[10%] right-[10%]',
      bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
      'bottom-left': 'bottom-[10%] left-[10%]',
      left: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
      'top-left': 'top-[10%] left-[10%]',
    };
    return positions[position] || '';
  };

  const approveItem = (itemId: string) => {
    setStagedItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, status: 'approved' } : item))
    );
  };

  const loadToTruck = (itemId: string) => {
    const item = stagedItems.find((i) => i.id === itemId);
    if (!item) return;

    setStagedItems((items) =>
      items.map((i) => (i.id === itemId ? { ...i, status: 'loaded' } : i))
    );

    setTrucks((trucks) =>
      trucks.map((truck, idx) =>
        idx === 0
          ? {
              ...truck,
              items: [...truck.items, item],
            }
          : truck
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'loaded':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Logistics Canvas - Circular Lifecycle Demo
        </h1>
        <p className="text-slate-600">
          Test the circular workflow concept. Navigate to <code className="px-2 py-1 bg-slate-200 rounded">/ops/canvas-demo</code>
        </p>
      </div>

      {/* Main Canvas */}
      <div className="relative w-full h-[800px] flex items-center justify-center">
        {/* Circular Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[700px] h-[700px] rounded-full border-4 border-dashed border-slate-300 opacity-30" />
          <div className="absolute w-[500px] h-[500px] rounded-full border-4 border-dashed border-slate-300 opacity-20" />
        </div>

        {/* Lifecycle Stages */}
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id === selectedStage ? null : stage.id)}
              className={`absolute ${getPositionClass(stage.position)} z-10 transition-all hover:scale-110`}
            >
              <div
                className={`${stage.color} rounded-full p-6 shadow-xl border-4 border-white hover:shadow-2xl transition-shadow`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-slate-700">{stage.name}</p>
              </div>
            </button>
          );
        })}

        {/* Staging Area (Center) */}
        <Card className="w-[450px] h-[450px] shadow-2xl border-4 border-slate-300 bg-white/95 backdrop-blur z-20 overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl">Staging Area</span>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Manual Create
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto h-[calc(100%-80px)]">
            <div className="space-y-3">
              {stagedItems.map((item) => (
                <Card
                  key={item.id}
                  className={`border-2 ${getStatusColor(item.status)} transition-all hover:shadow-md`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">
                          {item.orderId} - {item.customer}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {item.quantity}x {item.type.toUpperCase()} - {item.product}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {item.status === 'pending' && (
                        <Button size="sm" onClick={() => approveItem(item.id)} className="flex-1">
                          Approve
                        </Button>
                      )}
                      {item.status === 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => loadToTruck(item.id)}
                          variant="outline"
                          className="flex-1"
                        >
                          Load to Truck
                        </Button>
                      )}
                      {item.status === 'loaded' && (
                        <Badge className="flex-1 justify-center bg-blue-500">On Truck</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {stagedItems.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No items in staging</p>
                  <p className="text-xs mt-1">Drag items from lifecycle stages or create manually</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#cbd5e1" />
            </marker>
          </defs>
          {/* Draw circular flow lines */}
          <circle
            cx="50%"
            cy="50%"
            r="300"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="10,5"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Stage Detail Panel */}
      {selectedStage && (
        <Card className="mt-8 border-2 border-slate-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="flex items-center justify-between">
              <span>
                {stages.find((s) => s.id === selectedStage)?.name} Details
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStage(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedStage === 'delivery' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Active Trucks</h3>
                {trucks.map((truck) => (
                  <Card key={truck.truckId} className="border-2">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{truck.truckId}</span>
                        <Badge>{truck.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold mb-2">Loaded Items:</p>
                          {truck.items.length > 0 ? (
                            <ul className="text-sm space-y-1 text-slate-600">
                              {truck.items.map((item) => (
                                <li key={item.id}>
                                  • {item.quantity}x {item.type} - {item.product} ({item.customer})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-slate-400">No items loaded yet</p>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold mb-2">Delivery Stops:</p>
                          <ul className="text-sm space-y-1 text-slate-600">
                            {truck.stops.map((stop, idx) => (
                              <li key={idx}>
                                {idx + 1}. {stop.customer} - {stop.time}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button className="w-full mt-4" disabled={truck.items.length === 0}>
                          <Truck className="w-4 h-4 mr-2" />
                          Start Route
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {selectedStage === 'tax' && (
              <div>
                <p className="text-slate-600 mb-4">
                  Tax Determination (Bonded Storage) - Track when products leave bonded storage for
                  TTB compliance.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Recent Events:</p>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• 10 kegs moved to production - Tax triggered</li>
                    <li>• 5 cases bottled - Awaiting shipment</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedStage === 'production' && (
              <div>
                <p className="text-slate-600 mb-4">
                  Production House - Active batches and products ready for packaging.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Ready for Staging:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 20 kegs IPA (Batch #45)</li>
                    <li>• 15 kegs Lager (Batch #46)</li>
                    <li>• 100 bottles Pale Ale (Batch #44)</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedStage === 'packaging' && (
              <div>
                <p className="text-slate-600 mb-4">
                  Packaging - Bottling, canning, and case creation.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">Active Packaging:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Bottling line running - IPA</li>
                    <li>• 12-pack cases being created</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedStage === 'restaurant' && (
              <div>
                <p className="text-slate-600 mb-4">
                  Restaurant/Customer - Active deliveries and orders.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-900 mb-2">Today's Deliveries:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Joe's Bar - 2 kegs, 1 case (10:00 AM)</li>
                    <li>• Main St Pub - 5 kegs (10:30 AM)</li>
                    <li>• Downtown Pub - 3 kegs (11:00 AM)</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedStage === 'returns' && (
              <div>
                <p className="text-slate-600 mb-4">
                  Returns/Empties - Track returned kegs and containers.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Pending Returns:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 8 empty kegs from Joe's Bar</li>
                    <li>• 5 empty kegs from Main St Pub</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Route to Cleaning
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-3 text-blue-900">How to Test This Demo:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              <strong>1. Click lifecycle stage icons</strong> around the circle to see details
            </li>
            <li>
              <strong>2. Staging Area (center)</strong> shows orders ready to process
            </li>
            <li>
              <strong>3. Approve items</strong> to mark them ready for loading
            </li>
            <li>
              <strong>4. Load to Truck</strong> to assign items to delivery
            </li>
            <li>
              <strong>5. Click "Delivery" stage</strong> to see truck details and start route
            </li>
            <li>
              <strong>6. Status flow:</strong> Pending → Approved → Loaded → In-Route → Delivered
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
