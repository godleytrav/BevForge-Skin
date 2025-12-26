import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  lastUpdated: string;
  trend?: 'up' | 'down' | 'stable';
}

interface InventoryTableProps {
  items?: InventoryItem[];
  onItemClick?: (item: InventoryItem) => void;
  className?: string;
}

const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-secondary" />;
    case 'down':
      return <TrendingDown className="h-3 w-3 text-destructive" />;
    case 'stable':
    default:
      return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
};

const getStockStatus = (quantity: number, reorderPoint: number) => {
  if (quantity === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
  if (quantity <= reorderPoint) return { label: 'Low Stock', variant: 'default' as const };
  return { label: 'In Stock', variant: 'secondary' as const };
};

export default function InventoryTable({
  items = [],
  onItemClick,
  className = '',
}: InventoryTableProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono text-xs">Item</TableHead>
                <TableHead className="font-mono text-xs">Category</TableHead>
                <TableHead className="font-mono text-xs text-right">Quantity</TableHead>
                <TableHead className="font-mono text-xs text-right">Reorder Point</TableHead>
                <TableHead className="font-mono text-xs">Status</TableHead>
                <TableHead className="font-mono text-xs">Trend</TableHead>
                <TableHead className="font-mono text-xs">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const status = getStockStatus(item.quantity, item.reorderPoint);
                  return (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onItemClick?.(item)}
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.category}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {item.reorderPoint} {item.unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{getTrendIcon(item.trend)}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {item.lastUpdated}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
