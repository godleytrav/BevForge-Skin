import { useState, useEffect } from 'react';
import { Search, Plus, Package, AlertCircle, Edit } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { apiGet, apiPost, ApiError } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  qty_on_hand: number;
  reorder_point?: number;
  location?: string;
  status?: string;
}

interface InventoryMovement {
  product_id: string;
  movement_type: 'receive' | 'transfer' | 'waste' | 'cycle_count_adjust';
  qty_delta: number;
  note?: string;
}

const statusColors = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  'low stock': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'out of stock': 'bg-red-500/10 text-red-500 border-red-500/20',
};

async function fetchProducts(): Promise<Product[]> {
  try {
    return await apiGet<Product[]>('/api/inventory/products');
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Error('Products endpoint not implemented yet');
    }
    throw error;
  }
}

async function createMovement(payload: InventoryMovement): Promise<void> {
  try {
    await apiPost('/api/inventory/movements', payload);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Error('Inventory movements endpoint not implemented yet. Please implement POST /api/inventory/movements');
    }
    throw error;
  }
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [backendNotImplemented, setBackendNotImplemented] = useState(false);

  // Form state
  const [movementType, setMovementType] = useState<'receive' | 'transfer' | 'waste' | 'cycle_count_adjust'>('receive');
  const [qtyDelta, setQtyDelta] = useState<number>(0);
  const [note, setNote] = useState('');
  const [optimisticQty, setOptimisticQty] = useState<Record<string, number>>({});

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, products]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('not implemented')) {
        setError(err.message);
        setProducts([]);
        setFilteredProducts([]);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  }

  function getProductStatus(product: Product): 'active' | 'low stock' | 'out of stock' {
    if (product.qty_on_hand === 0) return 'out of stock';
    if (product.reorder_point && product.qty_on_hand <= product.reorder_point) return 'low stock';
    return 'active';
  }

  function getDisplayQty(productId: string, originalQty: number): number {
    return optimisticQty[productId] ?? originalQty;
  }

  function resetForm() {
    setMovementType('receive');
    setQtyDelta(0);
    setNote('');
    setSubmitError(null);
  }

  function openAdjustModal(product: Product) {
    setSelectedProduct(product);
    resetForm();
    setIsAdjustModalOpen(true);
  }

  async function handleAdjustQuantity() {
    if (!selectedProduct) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate
      if (qtyDelta === 0) {
        throw new Error('Quantity delta cannot be zero');
      }

      const payload: InventoryMovement = {
        product_id: selectedProduct.id,
        movement_type: movementType,
        qty_delta: qtyDelta,
        note: note.trim() || undefined,
      };

      // Try to create movement
      try {
        await createMovement(payload);
        // Backend succeeded - refresh products
        await loadProducts();
        setIsAdjustModalOpen(false);
        resetForm();
      } catch (err) {
        if (err instanceof Error && err.message.includes('not implemented')) {
          // Backend not implemented - update optimistically
          setBackendNotImplemented(true);
          const newQty = selectedProduct.qty_on_hand + qtyDelta;
          setOptimisticQty({
            ...optimisticQty,
            [selectedProduct.id]: newQty,
          });
          // Update local state
          setProducts(
            products.map((p) =>
              p.id === selectedProduct.id ? { ...p, qty_on_hand: newQty } : p
            )
          );
          setIsAdjustModalOpen(false);
          resetForm();
          setSubmitError('Movement recorded locally. Not persisted until backend endpoints exist.');
        } else {
          throw err;
        }
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to adjust quantity');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-1">Track product quantities and movements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Product
          </Button>
          <Button variant="outline" className="gap-2">
            <Package className="h-4 w-4" />
            Receive Stock
          </Button>
        </div>
      </div>

      {/* Backend Warning */}
      {backendNotImplemented && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Backend Not Implemented</p>
                <p className="text-sm">
                  Inventory adjustments are shown locally but not persisted. Implement POST /api/inventory/movements to save changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by name, SKU, or category..."
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
      {!loading && !error && filteredProducts.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No products match your search.' : 'Add your first product to start tracking inventory.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid gap-4">
          {filteredProducts.map((product) => {
            const status = getProductStatus(product);
            const displayQty = getDisplayQty(product.id, product.qty_on_hand);
            return (
              <Card key={product.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge className={statusColors[status]}>{status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.sku} • {product.category}
                        {product.location && ` • ${product.location}`}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAdjustModal(product)}
                      className="gap-2"
                    >
                      <Edit className="h-3 w-3" />
                      Adjust
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">On Hand</p>
                      <p className="text-2xl font-bold">{displayQty}</p>
                    </div>
                    {product.reorder_point && (
                      <div>
                        <p className="text-muted-foreground mb-1">Reorder Point</p>
                        <p className="text-lg font-semibold">{product.reorder_point}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground mb-1">Status</p>
                      <p className="text-lg font-semibold capitalize">{status}</p>
                    </div>
                  </div>
                  {displayQty <= (product.reorder_point || 0) && displayQty > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-yellow-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Below reorder point</span>
                    </div>
                  )}
                  {displayQty === 0 && (
                    <div className="mt-4 flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Out of stock</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Adjust Quantity Modal */}
      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Quantity</DialogTitle>
            <DialogDescription>
              {selectedProduct && `Update inventory for ${selectedProduct.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedProduct && (
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Current Quantity:</span>
                  <span className="text-lg font-bold">{getDisplayQty(selectedProduct.id, selectedProduct.qty_on_hand)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Quantity:</span>
                  <span className="text-lg font-bold text-primary">
                    {getDisplayQty(selectedProduct.id, selectedProduct.qty_on_hand) + qtyDelta}
                  </span>
                </div>
              </div>
            )}

            {/* Movement Type */}
            <div className="space-y-2">
              <Label htmlFor="movement_type">Movement Type *</Label>
              <Select value={movementType} onValueChange={(value: any) => setMovementType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receive">Receive (Add Stock)</SelectItem>
                  <SelectItem value="transfer">Transfer (Move Stock)</SelectItem>
                  <SelectItem value="waste">Waste (Remove Stock)</SelectItem>
                  <SelectItem value="cycle_count_adjust">Cycle Count Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Delta */}
            <div className="space-y-2">
              <Label htmlFor="qty_delta">Quantity Change *</Label>
              <Input
                id="qty_delta"
                type="number"
                value={qtyDelta}
                onChange={(e) => setQtyDelta(parseInt(e.target.value) || 0)}
                placeholder="Enter positive or negative number"
              />
              <p className="text-xs text-muted-foreground">
                Use positive numbers to add stock, negative to remove
              </p>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this adjustment..."
                rows={2}
              />
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
            <Button variant="outline" onClick={() => setIsAdjustModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAdjustQuantity} disabled={isSubmitting}>
              {isSubmitting ? 'Adjusting...' : 'Adjust Quantity'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
