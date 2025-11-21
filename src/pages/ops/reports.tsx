import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
  return (
    <AppShell pageTitle="Reports & Trends">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Trends</h1>
            <p className="text-muted-foreground mt-1">Analytics and business insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Revenue Trend</p>
                <p className="text-3xl font-bold">$45,280</p>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12.5% vs last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Order Volume</p>
                <p className="text-3xl font-bold">342</p>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8.3% vs last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-3xl font-bold">$132.46</p>
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <TrendingDown className="h-4 w-4" />
                  <span>-3.2% vs last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Customer Growth</p>
                <p className="text-3xl font-bold">1,248</p>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+15.7% vs last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Website Store</span>
                  <span className="text-sm text-muted-foreground">$18,450 (41%)</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '41%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Taproom</span>
                  <span className="text-sm text-muted-foreground">$15,820 (35%)</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Wholesale</span>
                  <span className="text-sm text-muted-foreground">$11,010 (24%)</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '24%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid hsl(200, 15%, 65%)',
          backdropFilter: 'blur(12px)',
        }}>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Honeycrisp Cider', sales: '$8,450', units: 156 },
                { name: 'Dry Hopped Cider', sales: '$6,280', units: 124 },
                { name: 'Barrel-Aged Reserve', sales: '$5,920', units: 89 },
                { name: 'Rosé Cider', sales: '$4,180', units: 98 },
                { name: 'Pear Cider', sales: '$3,640', units: 76 },
              ].map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.units} units sold</p>
                  </div>
                  <p className="font-semibold">{product.sales}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
