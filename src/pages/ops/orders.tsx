import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download } from 'lucide-react';

// Mock data
const mockOrders = [
  { id: 'ORD-001', customer: 'The Tap Room', date: '2024-11-20', total: 1250.00, status: 'fulfilled', items: 12 },
  { id: 'ORD-002', customer: 'Wine & Dine', date: '2024-11-20', total: 890.50, status: 'pending', items: 8 },
  { id: 'ORD-003', customer: 'Craft Beer Co', date: '2024-11-19', total: 2100.00, status: 'processing', items: 24 },
  { id: 'ORD-004', customer: 'Local Market', date: '2024-11-19', total: 450.00, status: 'fulfilled', items: 6 },
  { id: 'ORD-005', customer: 'Restaurant 45', date: '2024-11-18', total: 1680.00, status: 'fulfilled', items: 18 },
  { id: 'ORD-006', customer: 'Online Store', date: '2024-11-18', total: 125.00, status: 'cancelled', items: 2 },
];

const statusColors: Record<string, string> = {
  fulfilled: 'bg-green-500/20 text-green-400 border-green-500/50',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
};

export default function OrdersPage() {
  return (
    <AppShell pageTitle="Orders Management">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track all customer orders</p>
        </div>

        {/* Filters & Search */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid hsl(200, 15%, 65%)',
          backdropFilter: 'blur(12px)',
        }}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search orders by ID, customer, or date..." 
                  className="pl-10 bg-background/50"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid hsl(200, 15%, 65%)',
          backdropFilter: 'blur(12px)',
        }}>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{order.date}</td>
                      <td className="py-3 px-4 text-sm">{order.items} items</td>
                      <td className="py-3 px-4 font-semibold">${order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
