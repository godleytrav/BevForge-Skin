import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Package, TrendingDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';

// Mock product data
const mockProducts = [
  {
    id: 'P001',
    name: 'Heritage Dry Cider',
    sku: 'HDC-750',
    category: 'Cider',
    location: 'Taproom',
    onHand: 48,
    allocated: 12,
    available: 36,
    reorderPoint: 24,
    status: 'Active',
    description: 'Traditional dry cider made from heritage apples',
    channels: { website: true, taproom: true, wholesale: true },
    recentMovements: [
      { date: '2025-11-20', type: 'Sold', quantity: -6, reference: 'Order #1234' },
      { date: '2025-11-18', type: 'Received', quantity: 24, reference: 'PO-2025-11' },
      { date: '2025-11-15', type: 'Adjusted', quantity: -2, reference: 'Inventory count' },
    ]
  },
  {
    id: 'P002',
    name: 'Hopped Cider',
    sku: 'HC-750',
    category: 'Cider',
    location: 'Warehouse',
    onHand: 12,
    allocated: 8,
    available: 4,
    reorderPoint: 24,
    status: 'Low Stock',
    description: 'Dry cider with Cascade hops',
    channels: { website: true, taproom: true, wholesale: false },
    recentMovements: [
      { date: '2025-11-19', type: 'Sold', quantity: -12, reference: 'Order #1245' },
      { date: '2025-11-10', type: 'Received', quantity: 24, reference: 'PO-2025-10' },
    ]
  },
  {
    id: 'P003',
    name: 'Pear Cider',
    sku: 'PC-750',
    category: 'Cider',
    location: 'Taproom',
    onHand: 0,
    allocated: 0,
    available: 0,
    reorderPoint: 12,
    status: 'Out of Stock',
    description: 'Semi-sweet pear cider',
    channels: { website: false, taproom: false, wholesale: false },
    recentMovements: [
      { date: '2025-11-17', type: 'Sold', quantity: -8, reference: 'Order #1240' },
      { date: '2025-11-05', type: 'Received', quantity: 12, reference: 'PO-2025-09' },
    ]
  },
  {
    id: 'P004',
    name: 'Branded Pint Glass',
    sku: 'GLASS-16',
    category: 'Merch',
    location: 'Taproom',
    onHand: 144,
    allocated: 24,
    available: 120,
    reorderPoint: 48,
    status: 'Active',
    description: '16oz branded pint glass',
    channels: { website: true, taproom: true, wholesale: true },
    recentMovements: [
      { date: '2025-11-21', type: 'Sold', quantity: -6, reference: 'Order #1250' },
      { date: '2025-11-01', type: 'Received', quantity: 144, reference: 'PO-2025-08' },
    ]
  },
  {
    id: 'P005',
    name: 'Barrel-Aged Reserve',
    sku: 'BAR-750',
    category: 'Cider',
    location: 'Warehouse',
    onHand: 36,
    allocated: 6,
    available: 30,
    reorderPoint: 12,
    status: 'Active',
    description: 'Oak barrel-aged cider, limited release',
    channels: { website: true, taproom: true, wholesale: true },
    recentMovements: [
      { date: '2025-11-19', type: 'Sold', quantity: -3, reference: 'Order #1248' },
      { date: '2025-11-12', type: 'Received', quantity: 24, reference: 'PO-2025-11' },
    ]
  },
];

export default function InventoryPage() {
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');

  // Filter products
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'All' || product.location === locationFilter;
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    const matchesChannel = channelFilter === 'All' || 
                          (channelFilter === 'Website' && product.channels.website) ||
                          (channelFilter === 'Taproom' && product.channels.taproom) ||
                          (channelFilter === 'Wholesale' && product.channels.wholesale);
    
    return matchesSearch && matchesLocation && matchesStatus && matchesChannel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Low Stock': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Out of Stock': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <AppShell pageTitle="Products & Inventory">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Products & Inventory</h1>
            <div className="flex gap-2">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                New Product
              </Button>
              <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                <Package className="w-4 h-4 mr-2" />
                Receive Stock
              </Button>
              <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                <TrendingDown className="w-4 h-4 mr-2" />
                Adjust Inventory
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-blue-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px] bg-white/5 border-blue-500/30 text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Locations</SelectItem>
                <SelectItem value="Taproom">Taproom</SelectItem>
                <SelectItem value="Warehouse">Warehouse</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white/5 border-blue-500/30 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-[180px] bg-white/5 border-blue-500/30 text-white">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Channels</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Taproom">Taproom</SelectItem>
                <SelectItem value="Wholesale">Wholesale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products List */}
          <div className="lg:col-span-2">
            <Card 
              className="border-blue-500/30 bg-black/40"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 20px rgba(158, 178, 191, 0.3)',
              }}
            >
              <CardHeader>
                <CardTitle className="text-white">Products ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedProduct?.id === product.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-blue-500/20 bg-white/5 hover:border-blue-500/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{product.name}</h3>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">SKU: {product.sku} • {product.category}</p>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">On Hand</p>
                              <p className="text-white font-semibold">{product.onHand}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Allocated</p>
                              <p className="text-white font-semibold">{product.allocated}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Available</p>
                              <p className="text-emerald-400 font-semibold">{product.available}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Reorder At</p>
                              <p className="text-white font-semibold">{product.reorderPoint}</p>
                            </div>
                          </div>
                        </div>
                        {product.available <= product.reorderPoint && product.available > 0 && (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                        {product.available === 0 && (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Detail Panel */}
          <div className="lg:col-span-1">
            {selectedProduct ? (
              <Card 
                className="border-blue-500/30 bg-black/40 sticky top-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 20px rgba(158, 178, 191, 0.3)',
                }}
              >
                <CardHeader>
                  <CardTitle className="text-white">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">SKU: {selectedProduct.sku}</p>
                    <p className="text-sm text-gray-400 mb-2">Category: {selectedProduct.category}</p>
                    <p className="text-sm text-gray-300">{selectedProduct.description}</p>
                  </div>

                  {/* Inventory by Location */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Inventory</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-white/5 border border-blue-500/20">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-400">Location</span>
                          <span className="text-sm text-white">{selectedProduct.location}</span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-400">On Hand</span>
                          <span className="text-sm text-white font-semibold">{selectedProduct.onHand}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Reorder Point</span>
                          <span className="text-sm text-white">{selectedProduct.reorderPoint}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Channel Visibility */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Channel Visibility</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Website</span>
                        <Badge className={selectedProduct.channels.website ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}>
                          {selectedProduct.channels.website ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Taproom</span>
                        <Badge className={selectedProduct.channels.taproom ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}>
                          {selectedProduct.channels.taproom ? 'Available' : 'Not Available'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Wholesale</span>
                        <Badge className={selectedProduct.channels.wholesale ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}>
                          {selectedProduct.channels.wholesale ? 'Available' : 'Not Available'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Recent Stock Movements */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Recent Movements</h4>
                    <div className="space-y-2">
                      {selectedProduct.recentMovements.map((movement, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white/5 border border-blue-500/20">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-gray-400">{movement.date}</span>
                            <Badge className={
                              movement.type === 'Received' ? 'bg-emerald-500/20 text-emerald-400 text-xs' :
                              movement.type === 'Sold' ? 'bg-blue-500/20 text-blue-400 text-xs' :
                              'bg-amber-500/20 text-amber-400 text-xs'
                            }>
                              {movement.type}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">{movement.reference}</span>
                            <span className={`text-sm font-semibold ${movement.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card 
                className="border-blue-500/30 bg-black/40"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-400">Select a product to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}