import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, AlertTriangle } from 'lucide-react';

// Mock data
const mockInventory = [
  { id: 'SKU-001', name: 'Honeycrisp Cider', category: 'Cider', stock: 45, reorderPoint: 20, unit: 'cases', status: 'good' },
  { id: 'SKU-002', name: 'Dry Hopped Cider', category: 'Cider', stock: 12, reorderPoint: 15, unit: 'cases', status: 'low' },
  { id: 'SKU-003', name: 'Pear Cider', category: 'Cider', stock: 0, reorderPoint: 10, unit: 'cases', status: 'out' },
  { id: 'SKU-004', name: 'Rosé Cider', category: 'Cider', stock: 28, reorderPoint: 15, unit: 'cases', status: 'good' },
  { id: 'SKU-005', name: 'Barrel-Aged Reserve', category: 'Premium', stock: 8, reorderPoint: 5, unit: 'cases', status: 'good' },
  { id: 'SKU-006', name: 'Seasonal Blend', category: 'Seasonal', stock: 5, reorderPoint: 10, unit: 'cases', status: 'low' },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  good: { label: 'In Stock', className: 'bg-green-500/20 text-green-400 border-green-500/50' },
  low: { label: 'Low Stock', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
  out: { label: 'Out of Stock', className: 'bg-red-500/20 text-red-400 border-red-500/50' },
};

export default function InventoryPage() {
  const lowStockCount = mockInventory.filter(item => item.status === 'low' || item.status === 'out').length;

  return (
    <AppShell pageTitle="Inventory Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage product stock levels</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Alert Banner */}
        {lowStockCount > 0 && (
          <Card style={{
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid hsl(45, 93%, 47%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-semibold text-yellow-400">Low Stock Alert</p>
                  <p className="text-sm text-muted-foreground">{lowStockCount} products need attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search & Actions */}
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
                  placeholder="Search products by name, SKU, or category..." 
                  className="pl-10 bg-background/50"
                />
              </div>
              <Button variant="outline">Receive Inventory</Button>
              <Button variant="outline">Export Report</Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid hsl(200, 15%, 65%)',
          backdropFilter: 'blur(12px)',
        }}>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">SKU</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Current Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reorder Point</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInventory.map((item) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{item.id}</td>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.category}</td>
                      <td className="py-3 px-4">
                        <span className={item.status === 'out' ? 'text-red-400 font-semibold' : 'font-semibold'}>
                          {item.stock} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.reorderPoint} {item.unit}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusConfig[item.status].className}>
                          {statusConfig[item.status].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">Adjust</Button>
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
