import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/AppShell';

export default function OpsSales() {
  // Mock data
  const salesData = {
    totalRevenue: 45280.50,
    totalOrders: 156,
    avgOrderValue: 290.26,
    topChannel: 'Taproom',
    channels: [
      { name: 'Taproom', revenue: 22500, orders: 89, percentage: 49.7 },
      { name: 'Website', revenue: 15280, orders: 45, percentage: 33.7 },
      { name: 'Wholesale', revenue: 7500.50, orders: 22, percentage: 16.6 },
    ],
    topProducts: [
      { name: 'Honeycrisp Cider - 6pk', sold: 45, revenue: 6750 },
      { name: 'Dry Hopped Cider - Keg', sold: 12, revenue: 4800 },
      { name: 'Heritage Blend - Case', sold: 28, revenue: 3920 },
      { name: 'Pear Cider - 4pk', sold: 67, revenue: 3350 },
    ],
  };

  return (
    <AppShell pageTitle="Sales & Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/ops" 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              style={{ color: 'hsl(200, 15%, 65%)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Sales & Analytics</h1>
              <p className="text-gray-400 mt-1">Revenue and sales performance</p>
            </div>
          </div>
          <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white">
            <option>This Month</option>
            <option>This Week</option>
            <option>Today</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid hsl(200, 15%, 65%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4" style={{ color: 'hsl(200, 15%, 65%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${salesData.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-400 mt-1">+12.5% from last period</p>
            </CardContent>
          </Card>

          <Card 
            className="border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid hsl(200, 15%, 65%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
              <ShoppingCart className="w-4 h-4" style={{ color: 'hsl(200, 15%, 65%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{salesData.totalOrders}</div>
              <p className="text-xs text-green-400 mt-1">+8.3% from last period</p>
            </CardContent>
          </Card>

          <Card 
            className="border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid hsl(200, 15%, 65%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Order Value</CardTitle>
              <TrendingUp className="w-4 h-4" style={{ color: 'hsl(200, 15%, 65%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${salesData.avgOrderValue.toFixed(2)}</div>
              <p className="text-xs text-green-400 mt-1">+3.8% from last period</p>
            </CardContent>
          </Card>

          <Card 
            className="border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid hsl(200, 15%, 65%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Top Channel</CardTitle>
              <Users className="w-4 h-4" style={{ color: 'hsl(200, 15%, 65%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{salesData.topChannel}</div>
              <p className="text-xs text-gray-400 mt-1">49.7% of total sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales by Channel */}
        <Card 
          className="border-0"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-white">Sales by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.channels.map((channel) => (
                <div key={channel.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{channel.name}</span>
                    <span className="text-gray-400">${channel.revenue.toLocaleString()} ({channel.percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${channel.percentage}%`,
                        background: 'hsl(200, 15%, 65%)'
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-400">{channel.orders} orders</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card 
          className="border-0"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-white">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ background: 'hsl(200, 15%, 65%)', color: 'black' }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{product.name}</div>
                      <div className="text-sm text-gray-400">{product.sold} units sold</div>
                    </div>
                  </div>
                  <div className="text-white font-bold">${product.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
