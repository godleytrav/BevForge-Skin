import { useState } from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '@/layouts/Dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  Building2,
  Factory,
  Search,
  Plus,
  ShoppingCart,
  Truck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  FileText,
} from 'lucide-react';

// Mock data - replace with API calls
const mockCustomers = [
  {
    id: 'C001',
    name: 'Riverside Tavern',
    type: 'Restaurant',
    contact: 'John Smith',
    email: 'john@riverside.com',
    phone: '(555) 123-4567',
    address: '123 River St, Portland, OR',
    status: 'active',
    totalOrders: 45,
    totalRevenue: 12500,
    lastOrder: '2025-12-15',
    creditLimit: 5000,
    currentBalance: 1200,
  },
  {
    id: 'C002',
    name: 'Downtown Bottle Shop',
    type: 'Retail',
    contact: 'Sarah Johnson',
    email: 'sarah@downtown.com',
    phone: '(555) 234-5678',
    address: '456 Main St, Portland, OR',
    status: 'active',
    totalOrders: 78,
    totalRevenue: 28900,
    lastOrder: '2025-12-18',
    creditLimit: 10000,
    currentBalance: 3400,
  },
  {
    id: 'C003',
    name: 'Sunset Bar & Grill',
    type: 'Restaurant',
    contact: 'Mike Davis',
    email: 'mike@sunset.com',
    phone: '(555) 345-6789',
    address: '789 Sunset Blvd, Portland, OR',
    status: 'pending',
    totalOrders: 12,
    totalRevenue: 4200,
    lastOrder: '2025-12-10',
    creditLimit: 3000,
    currentBalance: 800,
  },
  {
    id: 'C004',
    name: 'Craft Beer Emporium',
    type: 'Retail',
    contact: 'Emily Chen',
    email: 'emily@craftemporium.com',
    phone: '(555) 456-7890',
    address: '321 Craft Ave, Portland, OR',
    status: 'active',
    totalOrders: 156,
    totalRevenue: 67800,
    lastOrder: '2025-12-19',
    creditLimit: 15000,
    currentBalance: 5600,
  },
];

const mockVendors = [
  {
    id: 'V001',
    name: 'Pacific Hops Supply',
    type: 'Ingredients',
    contact: 'Tom Wilson',
    email: 'tom@pacifichops.com',
    phone: '(555) 111-2222',
    address: '100 Hop Lane, Yakima, WA',
    status: 'active',
    totalPurchases: 89,
    totalSpend: 45600,
    lastPurchase: '2025-12-12',
    paymentTerms: 'Net 30',
  },
  {
    id: 'V002',
    name: 'Northwest Malt Co.',
    type: 'Ingredients',
    contact: 'Lisa Brown',
    email: 'lisa@nwmalt.com',
    phone: '(555) 222-3333',
    address: '200 Grain St, Seattle, WA',
    status: 'active',
    totalPurchases: 67,
    totalSpend: 34200,
    lastPurchase: '2025-12-14',
    paymentTerms: 'Net 30',
  },
  {
    id: 'V003',
    name: 'Keg & Barrel Supply',
    type: 'Equipment',
    contact: 'David Lee',
    email: 'david@kegbarrel.com',
    phone: '(555) 333-4444',
    address: '300 Industrial Way, Portland, OR',
    status: 'active',
    totalPurchases: 23,
    totalSpend: 18900,
    lastPurchase: '2025-11-28',
    paymentTerms: 'Net 15',
  },
];

const mockFacilities = [
  {
    id: 'F001',
    name: 'Main Production Facility',
    type: 'Brewery',
    address: '500 Brewery Ln, Portland, OR',
    capacity: '50,000 BBL/year',
    status: 'operational',
    manager: 'Alex Martinez',
    phone: '(555) 444-5555',
    currentUtilization: 78,
  },
  {
    id: 'F002',
    name: 'Eastside Warehouse',
    type: 'Storage',
    address: '600 Storage Dr, Portland, OR',
    capacity: '100,000 sq ft',
    status: 'operational',
    manager: 'Rachel Green',
    phone: '(555) 555-6666',
    currentUtilization: 65,
  },
  {
    id: 'F003',
    name: 'Taproom & Retail',
    type: 'Retail',
    address: '700 Main St, Portland, OR',
    capacity: '150 seats',
    status: 'operational',
    manager: 'Chris Taylor',
    phone: '(555) 666-7777',
    currentUtilization: 85,
  },
];

// Mock interaction history
const mockInteractions = [
  { date: '2025-12-19', type: 'order', description: 'Order #ORD-1234 - 10 kegs Pear Cider', amount: 850 },
  { date: '2025-12-15', type: 'delivery', description: 'Delivery completed - Order #ORD-1200', amount: 0 },
  { date: '2025-12-10', type: 'payment', description: 'Payment received - Invoice #INV-5678', amount: 1200 },
  { date: '2025-12-05', type: 'order', description: 'Order #ORD-1180 - 15 kegs IPA', amount: 1275 },
  { date: '2025-11-28', type: 'note', description: 'Customer requested delivery schedule change', amount: 0 },
];

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filterEntities = (entities: any[]) => {
    return entities.filter((entity) => {
      const matchesSearch =
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || entity.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
    setShowDetail(true);
  };

  return (
    <Dashboard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Directory</h1>
            <p className="text-muted-foreground">
              Manage customers, vendors, and facilities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, contact, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs for Customers, Vendors, Facilities */}
        <Tabs defaultValue="customers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="customers">
              <Users className="mr-2 h-4 w-4" />
              Customers ({mockCustomers.length})
            </TabsTrigger>
            <TabsTrigger value="vendors">
              <Building2 className="mr-2 h-4 w-4" />
              Vendors ({mockVendors.length})
            </TabsTrigger>
            <TabsTrigger value="facilities">
              <Factory className="mr-2 h-4 w-4" />
              Facilities ({mockFacilities.length})
            </TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterEntities(mockCustomers).map((customer) => (
                <Card
                  key={customer.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                  onClick={() => handleEntityClick(customer)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{customer.name}</CardTitle>
                        <CardDescription>{customer.type}</CardDescription>
                      </div>
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {customer.address}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm">
                        <div className="font-medium">{customer.totalOrders} orders</div>
                        <div className="text-muted-foreground">
                          ${customer.totalRevenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/ops/orders">
                            <ShoppingCart className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/ops/sales">
                            <Truck className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterEntities(mockVendors).map((vendor) => (
                <Card
                  key={vendor.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                  onClick={() => handleEntityClick(vendor)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription>{vendor.type}</CardDescription>
                      </div>
                      <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                        {vendor.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {vendor.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {vendor.address}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm">
                        <div className="font-medium">{vendor.totalPurchases} purchases</div>
                        <div className="text-muted-foreground">
                          ${vendor.totalSpend.toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="outline">{vendor.paymentTerms}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterEntities(mockFacilities).map((facility) => (
                <Card
                  key={facility.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                  onClick={() => handleEntityClick(facility)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <CardDescription>{facility.type}</CardDescription>
                      </div>
                      <Badge variant={facility.status === 'operational' ? 'default' : 'secondary'}>
                        {facility.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {facility.address}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        Capacity: {facility.capacity}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {facility.phone}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Utilization</span>
                        <span className="font-medium">{facility.currentUtilization}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${facility.currentUtilization}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedEntity?.name}</DialogTitle>
              <DialogDescription>{selectedEntity?.type}</DialogDescription>
            </DialogHeader>
            {selectedEntity && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedEntity.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selectedEntity.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {selectedEntity.address}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link to="/ops/orders">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Create Order
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/ops/sales">
                        <Truck className="mr-2 h-4 w-4" />
                        Schedule Delivery
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      View Documents
                    </Button>
                  </div>
                </div>

                {/* Statistics (for customers/vendors) */}
                {(selectedEntity.totalOrders || selectedEntity.totalPurchases) && (
                  <div>
                    <h3 className="font-semibold mb-3">Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>
                            {selectedEntity.totalOrders ? 'Total Orders' : 'Total Purchases'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {selectedEntity.totalOrders || selectedEntity.totalPurchases}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>
                            {selectedEntity.totalRevenue ? 'Total Revenue' : 'Total Spend'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            ${(selectedEntity.totalRevenue || selectedEntity.totalSpend).toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Last Activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm font-medium">
                            {selectedEntity.lastOrder || selectedEntity.lastPurchase}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Interaction History */}
                <div>
                  <h3 className="font-semibold mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {mockInteractions.map((interaction, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                      >
                        <div className="mt-1">
                          {interaction.type === 'order' && <ShoppingCart className="h-4 w-4 text-primary" />}
                          {interaction.type === 'delivery' && <Truck className="h-4 w-4 text-green-600" />}
                          {interaction.type === 'payment' && <DollarSign className="h-4 w-4 text-blue-600" />}
                          {interaction.type === 'note' && <FileText className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{interaction.description}</p>
                            {interaction.amount > 0 && (
                              <span className="text-sm font-medium">${interaction.amount}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {interaction.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Dashboard>
  );
}
