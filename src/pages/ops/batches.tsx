import { useState, useEffect } from 'react';
import { Plus, Search, Beaker, AlertCircle } from 'lucide-react';
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

interface Batch {
  id: string;
  name: string;
  base_type: 'cider_base' | 'juice' | 'perry_base';
  volume_gal: number;
  yeast: string;
  target_abv: number;
  start_date: string;
  status: 'planned' | 'fermenting' | 'conditioning' | 'packaged';
  notes?: string;
  created_at?: string;
}

interface CreateBatchPayload {
  name: string;
  base_type: string;
  volume_gal: number;
  yeast: string;
  target_abv: number;
  start_date: string;
  status: string;
  notes?: string;
}

const statusColors = {
  planned: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  fermenting: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  conditioning: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  packaged: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const baseTypeLabels = {
  cider_base: 'Cider Base',
  juice: 'Juice',
  perry_base: 'Perry Base',
};

async function fetchBatches(): Promise<Batch[]> {
  try {
    return await apiGet<Batch[]>('/api/batches');
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Error('Batches endpoint not implemented yet. Please implement GET /api/batches');
    }
    throw error;
  }
}

async function createBatch(payload: CreateBatchPayload): Promise<Batch> {
  try {
    return await apiPost<Batch>('/api/batches', payload);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Error('Batch creation endpoint not implemented yet. Please implement POST /api/batches');
    }
    throw error;
  }
}

// Batch update function - available for future use
// async function updateBatch(id: string, payload: Partial<CreateBatchPayload>): Promise<Batch> {
//   try {
//     return await apiPatch<Batch>(`/api/batches/${id}`, payload);
//   } catch (error) {
//     if (error instanceof ApiError && error.status === 404) {
//       throw new Error('Batch update endpoint not implemented yet. Please implement PATCH /api/batches/{id}');
//     }
//     throw error;
//   }
// }

export default function Batches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [baseType, setBaseType] = useState<'cider_base' | 'juice' | 'perry_base'>('cider_base');
  const [volumeGal, setVolumeGal] = useState<number>(0);
  const [yeast, setYeast] = useState('');
  const [targetAbv, setTargetAbv] = useState<number>(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'planned' | 'fermenting' | 'conditioning' | 'packaged'>('planned');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBatches(batches);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredBatches(
        batches.filter(
          (batch) =>
            batch.name.toLowerCase().includes(query) ||
            batch.yeast.toLowerCase().includes(query) ||
            batch.status.toLowerCase().includes(query) ||
            batch.base_type.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, batches]);

  async function loadBatches() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBatches();
      const batchesArray = Array.isArray(data) ? data : [];
      setBatches(batchesArray);
      setFilteredBatches(batchesArray);
    } catch (err) {
      if (err instanceof Error && err.message.includes('not implemented')) {
        setError(err.message);
        setBatches([]);
        setFilteredBatches([]);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch batches');
      }
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName('');
    setBaseType('cider_base');
    setVolumeGal(0);
    setYeast('');
    setTargetAbv(0);
    setStartDate(new Date().toISOString().split('T')[0]);
    setStatus('planned');
    setNotes('');
    setSubmitError(null);
  }

  async function handleCreateBatch() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate
      if (!name.trim()) {
        throw new Error('Batch name is required');
      }
      if (volumeGal <= 0) {
        throw new Error('Volume must be greater than 0');
      }
      if (!yeast.trim()) {
        throw new Error('Yeast type is required');
      }
      if (targetAbv <= 0) {
        throw new Error('Target ABV must be greater than 0');
      }

      const payload: CreateBatchPayload = {
        name,
        base_type: baseType,
        volume_gal: volumeGal,
        yeast,
        target_abv: targetAbv,
        start_date: startDate,
        status,
        notes: notes.trim() || undefined,
      };

      const newBatch = await createBatch(payload);
      setBatches([newBatch, ...batches]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batches</h1>
          <p className="text-muted-foreground mt-1">Track production batches from planning to packaging</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Batch
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search batches by name, yeast, status..."
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
      {!loading && !error && filteredBatches.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Beaker className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No batches yet</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No batches match your search.' : 'Create your first batch to start tracking production.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Batch
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batches List */}
      {!loading && filteredBatches.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredBatches.map((batch) => (
            <Card key={batch.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{batch.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Batch #{batch.id}</p>
                  </div>
                  <Badge className={statusColors[batch.status]}>{batch.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Type:</span>
                    <span className="font-medium">{baseTypeLabels[batch.base_type]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="font-medium">{batch.volume_gal} gal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yeast:</span>
                    <span className="font-medium">{batch.yeast}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target ABV:</span>
                    <span className="font-medium">{batch.target_abv}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{new Date(batch.start_date).toLocaleDateString()}</span>
                  </div>
                  {batch.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-muted-foreground text-xs">Notes:</p>
                      <p className="text-sm mt-1">{batch.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
            <DialogDescription>Add a new production batch to track through the brewing process.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Batch Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Batch Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Autumn Harvest 2024"
              />
            </div>

            {/* Base Type */}
            <div className="space-y-2">
              <Label htmlFor="base_type">Base Type *</Label>
              <Select value={baseType} onValueChange={(value: any) => setBaseType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cider_base">Cider Base</SelectItem>
                  <SelectItem value="juice">Juice</SelectItem>
                  <SelectItem value="perry_base">Perry Base</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <Label htmlFor="volume_gal">Volume (gallons) *</Label>
              <Input
                id="volume_gal"
                type="number"
                min="0"
                step="0.1"
                value={volumeGal}
                onChange={(e) => setVolumeGal(parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>

            {/* Yeast */}
            <div className="space-y-2">
              <Label htmlFor="yeast">Yeast *</Label>
              <Input
                id="yeast"
                value={yeast}
                onChange={(e) => setYeast(e.target.value)}
                placeholder="e.g., Safale US-05"
              />
            </div>

            {/* Target ABV */}
            <div className="space-y-2">
              <Label htmlFor="target_abv">Target ABV (%) *</Label>
              <Input
                id="target_abv"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={targetAbv}
                onChange={(e) => setTargetAbv(parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="fermenting">Fermenting</SelectItem>
                  <SelectItem value="conditioning">Conditioning</SelectItem>
                  <SelectItem value="packaged">Packaged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this batch..."
                rows={3}
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
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateBatch} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Batch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
