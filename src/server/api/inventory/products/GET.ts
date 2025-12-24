import type { Request, Response } from 'express';

/**
 * GET /api/inventory/products
 * Fetch all inventory products
 * 
 * NOTE: This endpoint returns CONTROL DATASET for testing.
 * In production, this would query the database.
 */
export default async function handler(_req: Request, res: Response) {
  try {
    // CONTROL DATASET - 3 test products for order simulation
    const products = [
      {
        id: 'PROD-001',
        name: 'Hoppy Trail IPA',
        sku: 'IPA-KEG-50L',
        category: 'Beer',
        type: 'IPA',
        container: '50L Keg',
        quantity: 25,
        unit: 'kegs',
        reorder_point: 10,
        unit_cost: 180.00,
        location: 'Warehouse A',
        last_updated: '2025-12-24T08:00:00Z',
        status: 'active',
      },
      {
        id: 'PROD-002',
        name: 'Golden Lager',
        sku: 'LAGER-CASE-24',
        category: 'Beer',
        type: 'Lager',
        container: 'Case (24x330ml)',
        quantity: 100,
        unit: 'cases',
        reorder_point: 20,
        unit_cost: 48.00,
        location: 'Warehouse A',
        last_updated: '2025-12-24T08:00:00Z',
        status: 'active',
      },
      {
        id: 'PROD-003',
        name: 'Dark Night Stout',
        sku: 'STOUT-KEG-30L',
        category: 'Beer',
        type: 'Stout',
        container: '30L Keg',
        quantity: 15,
        unit: 'kegs',
        reorder_point: 5,
        unit_cost: 120.00,
        location: 'Warehouse B',
        last_updated: '2025-12-24T08:00:00Z',
        status: 'active',
      },
    ];

    res.json(products);
  } catch (error) {
    console.error('Error fetching inventory products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch inventory products',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
