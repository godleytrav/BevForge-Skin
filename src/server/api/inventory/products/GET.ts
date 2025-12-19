import type { Request, Response } from 'express';

/**
 * GET /api/inventory/products
 * Fetch all inventory products
 */
export default async function handler(_req: Request, res: Response) {
  try {
    // Mock data - replace with actual database queries
    const products = [
      {
        id: 1,
        name: 'IPA Keg (1/2 BBL)',
        sku: 'KEG-IPA-HALF',
        category: 'Kegs',
        quantity: 45,
        unit: 'kegs',
        reorder_point: 20,
        unit_cost: 150.00,
        location: 'Warehouse A',
        last_updated: '2025-12-19T10:00:00Z',
      },
      {
        id: 2,
        name: 'Lager Keg (1/2 BBL)',
        sku: 'KEG-LAGER-HALF',
        category: 'Kegs',
        quantity: 32,
        unit: 'kegs',
        reorder_point: 20,
        unit_cost: 100.00,
        location: 'Warehouse A',
        last_updated: '2025-12-19T10:00:00Z',
      },
      {
        id: 3,
        name: 'Stout Keg (1/2 BBL)',
        sku: 'KEG-STOUT-HALF',
        category: 'Kegs',
        quantity: 18,
        unit: 'kegs',
        reorder_point: 20,
        unit_cost: 200.00,
        location: 'Warehouse B',
        last_updated: '2025-12-19T10:00:00Z',
      },
      {
        id: 4,
        name: 'Pale Ale Keg (1/2 BBL)',
        sku: 'KEG-PALE-HALF',
        category: 'Kegs',
        quantity: 28,
        unit: 'kegs',
        reorder_point: 15,
        unit_cost: 150.00,
        location: 'Warehouse A',
        last_updated: '2025-12-19T10:00:00Z',
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
