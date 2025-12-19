import type { Request, Response } from 'express';

/**
 * GET /api/batches
 * Fetch all production batches
 */
export default async function handler(_req: Request, res: Response) {
  try {
    // Mock data - replace with actual database queries
    const batches = [
      {
        id: 1,
        batch_number: 'BATCH-2025-001',
        product_name: 'IPA',
        brew_date: '2025-12-10',
        status: 'fermenting',
        quantity: 500,
        unit: 'gallons',
        expected_completion: '2025-12-24',
        notes: 'Standard IPA recipe, fermentation on schedule',
        created_at: '2025-12-10T08:00:00Z',
      },
      {
        id: 2,
        batch_number: 'BATCH-2025-002',
        product_name: 'Lager',
        brew_date: '2025-12-12',
        status: 'brewing',
        quantity: 750,
        unit: 'gallons',
        expected_completion: '2026-01-05',
        notes: 'Extended lagering period required',
        created_at: '2025-12-12T09:00:00Z',
      },
      {
        id: 3,
        batch_number: 'BATCH-2025-003',
        product_name: 'Stout',
        brew_date: '2025-12-05',
        status: 'completed',
        quantity: 400,
        unit: 'gallons',
        expected_completion: '2025-12-19',
        notes: 'Ready for kegging',
        created_at: '2025-12-05T07:30:00Z',
      },
    ];

    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ 
      error: 'Failed to fetch batches',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
