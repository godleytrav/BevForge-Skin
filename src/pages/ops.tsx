import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Package, Users } from 'lucide-react';
import { useState } from 'react';

export default function OpsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Ops – Business Operations</h1>
        <p className="text-muted-foreground">
          Welcome to the Ops suite. Manage finances, inventory, sales, and business analytics.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Management */}
        <Card 
          className="backdrop-blur-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
            boxShadow: hoveredCard === 'finance' ? '0 0 20px rgba(147, 167, 178, 0.4)' : 'none'
          }}
          onMouseEnter={() => setHoveredCard('finance')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" style={{ color: 'hsl(175, 70%, 50%)' }} />
              Financial Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track revenue, expenses, profit margins, and financial forecasting.
            </p>
          </CardContent>
        </Card>

        {/* Sales Analytics */}
        <Card 
          className="backdrop-blur-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
            boxShadow: hoveredCard === 'sales' ? '0 0 20px rgba(147, 167, 178, 0.4)' : 'none'
          }}
          onMouseEnter={() => setHoveredCard('sales')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: 'hsl(175, 70%, 50%)' }} />
              Sales Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze sales trends, customer behavior, and revenue optimization.
            </p>
          </CardContent>
        </Card>

        {/* Inventory Management */}
        <Card 
          className="backdrop-blur-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
            boxShadow: hoveredCard === 'inventory' ? '0 0 20px rgba(147, 167, 178, 0.4)' : 'none'
          }}
          onMouseEnter={() => setHoveredCard('inventory')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" style={{ color: 'hsl(175, 70%, 50%)' }} />
              Inventory Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor stock levels, reorder points, and supply chain operations.
            </p>
          </CardContent>
        </Card>

        {/* Customer Relations */}
        <Card 
          className="backdrop-blur-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
            boxShadow: hoveredCard === 'customers' ? '0 0 20px rgba(147, 167, 178, 0.4)' : 'none'
          }}
          onMouseEnter={() => setHoveredCard('customers')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" style={{ color: 'hsl(175, 70%, 50%)' }} />
              Customer Relations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage customer data, loyalty programs, and relationship tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
