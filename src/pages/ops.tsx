import { AppShell } from '@/components/AppShell';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Package, ShoppingCart, DollarSign, FileText, Download, Beaker } from 'lucide-react';

export default function OpsPage() {
  // Mock data
  const salesTotal = '$2,847.50';
  const ordersCount = 23;
  const ordersUnfulfilled = 3;
  const lowStockItems = 5;
  const trendStatus = 'up';
  const trendPercent = '+12%';
  const complianceStatus = 'compliant';
  const taxOwed = '$342.18';
  const taxDueDate = 'Dec 15, 2025';

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

  const inventoryAlerts = [
    { product: 'Original Dry Cider', quantity: 12, unit: 'cases' },
    { product: 'Raspberry Cider', quantity: 8, unit: 'cases' },
    { product: 'Pint Glasses', quantity: 15, unit: 'units' },
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

        {/* Quick-Look Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                View Sales & Orders <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          </Link>

          {/* Orders Tile */}
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
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ordersCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {ordersUnfulfilled} unfulfilled
              </p>
              <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                View Orders <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          </Link>

          {/* Inventory Tile */}
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
              <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Items low or out of stock
              </p>
              <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                View Inventory <ArrowUpRight className="ml-1 h-3 w-3" />
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

          {/* Trends Tile */}
          <Link to="/ops/reports">
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
              <CardTitle className="text-sm font-medium">Trends</CardTitle>
              {trendStatus === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trendPercent}</div>
              <p className="text-xs text-muted-foreground mt-1">
                vs. previous period
              </p>
              <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                View Reports <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          </Link>

          {/* Compliance Tile */}
          <Link to="/ops/compliance">
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
              <CardTitle className="text-sm font-medium">Compliance</CardTitle>
              {complianceStatus === 'compliant' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{complianceStatus}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All requirements met
              </p>
              <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                View Compliance <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
          </Link>

          {/* Tax Tile */}
          <Link to="/ops/tax">
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
              <CardTitle className="text-sm font-medium">Tax</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taxOwed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Due: {taxDueDate}
              </p>
              <Button variant="link" className="mt-2 p-0 h-auto text-xs">
                View Tax Summary <ArrowUpRight className="ml-1 h-3 w-3" />
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

        {/* Supporting Panels */}
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

          {/* Inventory Alerts */}
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryAlerts.map((item) => (
                  <div key={item.product} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.product}</p>
                      <p className="text-xs text-red-500">Low stock</p>
                    </div>
                    <p className="text-sm font-bold">{item.quantity} {item.unit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
