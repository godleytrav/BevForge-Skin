import { AppShell } from '@/components/AppShell';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  FileText, 
  Download, 
  Beaker,
  Truck,
  AlertTriangle,
  Clock,
  XCircle
} from 'lucide-react';

export default function OpsPage() {
  // Mock data - Enhanced with operational awareness
  const salesTotal = '$2,847.50';
  const ordersCount = 23;
  const ordersRequiringAction = 5; // NEW: Orders that need attention
  const ordersUnfulfilled = 3;
  const lowStockItems = 5;
  const complianceStatus: 'compliant' | 'at-risk' = 'at-risk'; // Changed to show risk state
  const complianceDeadlines = 2; // NEW: Upcoming deadlines
  
  // NEW: Deliveries data
  const deliveriesScheduled = 4;
  const deliveriesOverdue = 1;
  
  // NEW: Inventory at risk
  const inventoryAtRisk = 3; // Items expiring soon or damaged

  // NEW: Orders requiring action
  const actionableOrders = [
    { id: '#1235', customer: 'ABC Distributors', issue: 'Payment pending', priority: 'high' },
    { id: '#1236', customer: 'Main Street Pub', issue: 'Address verification needed', priority: 'medium' },
    { id: '#1237', customer: 'Downtown Taproom', issue: 'Stock unavailable', priority: 'high' },
    { id: '#1238', customer: 'City Brewery', issue: 'Delivery date conflict', priority: 'medium' },
    { id: '#1239', customer: 'Riverside Bar', issue: 'Special handling required', priority: 'low' },
  ];

  // NEW: Delivery status
  const deliveryStatus = [
    { id: 'DEL-001', destination: 'ABC Distributors', status: 'overdue', dueDate: 'Dec 18' },
    { id: 'DEL-002', destination: 'Main Street Pub', status: 'scheduled', dueDate: 'Dec 20' },
    { id: 'DEL-003', destination: 'Downtown Taproom', status: 'scheduled', dueDate: 'Dec 21' },
    { id: 'DEL-004', destination: 'City Brewery', status: 'in-transit', dueDate: 'Dec 19' },
  ];

  // NEW: Compliance deadlines
  const complianceItems = [
    { task: 'TTB Report Filing', dueDate: 'Dec 22, 2025', status: 'pending', priority: 'high' },
    { task: 'State Excise Tax Payment', dueDate: 'Dec 31, 2025', status: 'pending', priority: 'medium' },
  ];

  // Enhanced inventory alerts with risk indicators
  const inventoryAlerts = [
    { product: 'Original Dry Cider', quantity: 12, unit: 'cases', risk: 'low-stock' },
    { product: 'Raspberry Cider', quantity: 8, unit: 'cases', risk: 'low-stock' },
    { product: 'Pint Glasses', quantity: 15, unit: 'units', risk: 'low-stock' },
    { product: 'Batch #234 - Pear Cider', quantity: 45, unit: 'gallons', risk: 'expiring-soon' },
    { product: 'Kegs (damaged)', quantity: 3, unit: 'units', risk: 'damaged' },
  ];

  const salesByChannel = [
    { channel: 'Website', amount: '$1,245.00', percent: '44%' },
    { channel: 'Taproom', amount: '$1,102.50', percent: '39%' },
    { channel: 'Wholesale', amount: '$500.00', percent: '17%' },
  ];

  const recentOrders = [
    { id: '#1234', customer: 'John Smith', amount: '$45.00', status: 'Fulfilled' },
    { id: '#1233', customer: 'Sarah Johnson', amount: '$89.50', status: 'Processing' },
    { id: '#1232', customer: 'Mike Brown', amount: '$125.00', status: 'Fulfilled' },
  ];

  return (
    <AppShell pageTitle="OPS — Business Overview">
      <div className="space-y-6">
        {/* Header with Date Range Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">OPS — Business Overview</h1>
            <p className="text-muted-foreground mt-1">Godley Ciders operations dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => (window.location.href = '/ops/canvas')}
            >
              <Truck className="h-4 w-4" />
              Logistics Canvas
            </Button>
            <Select defaultValue="today">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CRITICAL ALERTS BANNER - NEW */}
        {(ordersRequiringAction > 0 || deliveriesOverdue > 0 || complianceDeadlines > 0 || inventoryAtRisk > 0) && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-lg">Items Requiring Attention</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {ordersRequiringAction > 0 && (
                  <Link to="/ops/orders" className="flex items-center gap-2 text-sm hover:underline">
                    <Badge variant="destructive">{ordersRequiringAction}</Badge>
                    <span>Orders need action</span>
                  </Link>
                )}
                {deliveriesOverdue > 0 && (
                  <Link to="/ops/sales" className="flex items-center gap-2 text-sm hover:underline">
                    <Badge variant="destructive">{deliveriesOverdue}</Badge>
                    <span>Overdue deliveries</span>
                  </Link>
                )}
                {complianceDeadlines > 0 && (
                  <Link to="/ops/compliance" className="flex items-center gap-2 text-sm hover:underline">
                    <Badge variant="destructive">{complianceDeadlines}</Badge>
                    <span>Compliance deadlines approaching</span>
                  </Link>
                )}
                {inventoryAtRisk > 0 && (
                  <Link to="/ops/inventory" className="flex items-center gap-2 text-sm hover:underline">
                    <Badge variant="destructive">{inventoryAtRisk}</Badge>
                    <span>Inventory items at risk</span>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick-Look Tiles - ENHANCED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Orders Requiring Action Tile - NEW */}
          <Link to="/ops/orders">
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg border-yellow-500/50"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders - Action Required</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{ordersRequiringAction}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need immediate attention
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View Orders <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Deliveries Tile - NEW */}
          <Link to="/ops/sales">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${deliveriesOverdue > 0 ? 'border-red-500/50' : 'border-border'}`}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = deliveriesOverdue > 0 
                  ? '0 0 20px rgba(239, 68, 68, 0.4)'
                  : '0 0 20px rgba(166, 173, 186, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveriesScheduled}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {deliveriesOverdue > 0 ? (
                    <span className="text-red-500 font-semibold">{deliveriesOverdue} overdue</span>
                  ) : (
                    'All on schedule'
                  )}
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View Deliveries <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Compliance Deadlines Tile - ENHANCED */}
          <Link to="/ops/compliance">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${complianceStatus === 'at-risk' ? 'border-yellow-500/50' : 'border-border'}`}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = complianceStatus === 'at-risk'
                  ? '0 0 20px rgba(234, 179, 8, 0.4)'
                  : '0 0 20px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance</CardTitle>
                {complianceStatus === 'at-risk' ? (
                  <Clock className="h-4 w-4 text-yellow-500" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{complianceDeadlines}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {complianceStatus === 'at-risk' ? 'Deadlines approaching' : 'All requirements met'}
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View Compliance <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Inventory At Risk Tile - ENHANCED */}
          <Link to="/ops/inventory">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${inventoryAtRisk > 0 ? 'border-red-500/50' : 'border-border'}`}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = inventoryAtRisk > 0
                  ? '0 0 20px rgba(239, 68, 68, 0.4)'
                  : '0 0 20px rgba(166, 173, 186, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory At Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{inventoryAtRisk}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Expiring or damaged items
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View Inventory <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Sales Tile */}
          <Link to="/ops/sales">
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid hsl(200, 15%, 65%)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(166, 173, 186, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesTotal}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Multi-channel revenue
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View Sales <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* All Orders Tile */}
          <Link to="/ops/orders">
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid hsl(200, 15%, 65%)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(166, 173, 186, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">All Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ordersCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {ordersUnfulfilled} unfulfilled
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View All Orders <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* All Inventory Tile */}
          <Link to="/ops/inventory">
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid hsl(200, 15%, 65%)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(166, 173, 186, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">All Inventory</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockItems}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Items low stock
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View All Inventory <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Batches Tile */}
          <Link to="/ops/batches">
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid hsl(200, 15%, 65%)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(166, 173, 186, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Batches</CardTitle>
                <Beaker className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active production batches
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                  View Batches <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Action Center */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid hsl(200, 15%, 65%)',
          backdropFilter: 'blur(12px)',
        }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Fast-access operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Package className="mr-2 h-4 w-4" />
                Create New Product
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Receive Inventory
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Sync Website Store
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Supporting Panels - ENHANCED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Requiring Action - NEW */}
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardHeader>
              <CardTitle>Orders Requiring Action</CardTitle>
              <CardDescription>Issues that need resolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actionableOrders.slice(0, 3).map((order) => (
                  <Link 
                    key={order.id} 
                    to="/ops/orders"
                    className="flex items-center justify-between p-2 rounded hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{order.id}</p>
                        <Badge 
                          variant={order.priority === 'high' ? 'destructive' : order.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {order.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-yellow-500 mt-1">{order.issue}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
              <Button variant="link" className="mt-3 p-0 h-auto text-xs w-full justify-center">
                View all {actionableOrders.length} orders
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Status - NEW */}
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
              <CardDescription>Scheduled and in-transit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deliveryStatus.map((delivery) => (
                  <Link 
                    key={delivery.id} 
                    to="/ops/sales"
                    className="flex items-center justify-between p-2 rounded hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{delivery.id}</p>
                        {delivery.status === 'overdue' && (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        {delivery.status === 'in-transit' && (
                          <Truck className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{delivery.destination}</p>
                      <p className={`text-xs mt-1 ${delivery.status === 'overdue' ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                        Due: {delivery.dueDate}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Deadlines - NEW */}
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardHeader>
              <CardTitle>Compliance Deadlines</CardTitle>
              <CardDescription>Upcoming requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceItems.map((item, idx) => (
                  <Link 
                    key={idx} 
                    to="/ops/compliance"
                    className="flex items-center justify-between p-2 rounded hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{item.task}</p>
                        <Badge 
                          variant={item.priority === 'high' ? 'destructive' : 'default'}
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Due: {item.dueDate}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales by Channel */}
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardHeader>
              <CardTitle>Sales by Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByChannel.map((channel) => (
                  <div key={channel.channel} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{channel.channel}</p>
                      <p className="text-xs text-muted-foreground">{channel.percent} of total</p>
                    </div>
                    <p className="text-sm font-bold">{channel.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{order.amount}</p>
                      <p className="text-xs text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts - ENHANCED */}
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Items needing attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventoryAlerts.slice(0, 4).map((item, idx) => (
                  <Link 
                    key={idx} 
                    to="/ops/inventory"
                    className="flex items-center justify-between p-2 rounded hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product}</p>
                      <p className={`text-xs font-semibold ${
                        item.risk === 'damaged' ? 'text-red-500' : 
                        item.risk === 'expiring-soon' ? 'text-yellow-500' : 
                        'text-orange-500'
                      }`}>
                        {item.risk === 'damaged' ? 'Damaged' : 
                         item.risk === 'expiring-soon' ? 'Expiring soon' : 
                         'Low stock'}
                      </p>
                    </div>
                    <p className="text-sm font-bold">{item.quantity} {item.unit}</p>
                  </Link>
                ))}
              </div>
              <Button variant="link" className="mt-3 p-0 h-auto text-xs w-full justify-center">
                View all alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
