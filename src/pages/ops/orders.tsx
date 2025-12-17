import { useState, useEffect } from 'react';
import { Plus, Search, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiGet, apiPost, ApiError } from '@/lib/api';

interface OrderLineItem {
  id?: string;
  item_name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  order_date: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  line_items: OrderLineItem[];
  total: number;
  created_at?: string;
}

interface CreateOrderPayload {
  customer_name: string;
  order_date: string;
  status: string;
  line_items: OrderLineItem[];
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  fulfilled: 'bg-green-500/10 text-green-500 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  try {
    return await apiPost<Order>('/api/orders', payload);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Error('Order creation endpoint not implemented on backend yet. Please implement POST /api/orders');
    }
    throw error;
  }
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'pending' | 'processing' | 'fulfilled' | 'cancelled'>('pending');
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([
    { item_name: '', qty: 1, price: 0 },
  ]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.customer_name.toLowerCase().includes(query) ||
            order.id.toLowerCase().includes(query) ||
            order.status.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, orders]);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Order[]>('/api/orders');
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('Orders endpoint not yet implemented');
        setOrders([]);
        setFilteredOrders([]);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setCustomerName('');
    setOrderDate(new Date().toISOString().split('T')[0]);
    setStatus('pending');
    setLineItems([{ item_name: '', qty: 1, price: 0 }]);
    setSubmitError(null);
  }

  function addLineItem() {
    setLineItems([...lineItems, { item_name: '', qty: 1, price: 0 }]);
  }

  function removeLineItem(index: number) {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  }

  function updateLineItem(index: number, field: keyof OrderLineItem, value: string | number) {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  }

  function calculateTotal(): number {
    return lineItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  async function handleCreateOrder() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate
      if (!customerName.trim()) {
        throw new Error('Customer name is required');
      }
      if (lineItems.length === 0 || lineItems.some((item) => !item.item_name.trim())) {
        throw new Error('At least one valid line item is required');
      }

      const payload: CreateOrderPayload = {
        customer_name: customerName,
        order_date: orderDate,
        status,
        line_items: lineItems.map((item) => ({
          item_name: item.item_name,
          qty: item.qty,
          price: item.price,
        })),
      };

      const newOrder = await createOrder(payload);
      setOrders([newOrder, ...orders]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and fulfillment</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Order
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders by customer, ID, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOrders.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No orders match your search.' : 'Create your first order to get started.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {!loading && filteredOrders.length > 0 && (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{order.customer_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Order #{order.id}</p>
                  </div>
                  <Badge className={statusColors[order.status]}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span className="font-medium">{new Date(order.order_date).toLocaleDateString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">Line Items:</p>
                    <div className="space-y-1">
                      {order.line_items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.qty}x {item.item_name}
                          </span>
                          <span className="font-medium">${(item.qty * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t pt-3">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Order Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Add a new customer order with line items.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            {/* Order Date */}
            <div className="space-y-2">
              <Label htmlFor="order_date">Order Date *</Label>
              <Input
                id="order_date"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Line Items *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </div>

              {lineItems.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-6">
                      <Label htmlFor={`item_name_${index}`} className="text-xs">
                        Item Name
                      </Label>
                      <Input
                        id={`item_name_${index}`}
                        value={item.item_name}
                        onChange={(e) => updateLineItem(index, 'item_name', e.target.value)}
                        placeholder="Product name"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`qty_${index}`} className="text-xs">
                        Qty
                      </Label>
                      <Input
                        id={`qty_${index}`}
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateLineItem(index, 'qty', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`price_${index}`} className="text-xs">
                        Price
                      </Label>
                      <Input
                        id={`price_${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateLineItem(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1 flex items-end">
                      {lineItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-right text-sm text-muted-foreground">
                    Subtotal: ${(item.qty * item.price).toFixed(2)}
                  </div>
                </Card>
              ))}

              <div className="flex justify-end text-lg font-semibold pt-2 border-t">
                Total: ${calculateTotal().toFixed(2)}
              </div>
            </div>

            {/* Error Display */}
            {submitError && (
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <p>{submitError}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
