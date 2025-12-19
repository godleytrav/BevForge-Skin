import type { Request, Response } from 'express';

/**
 * GET /api/orders
 * Fetch all orders with line items
 */
export default async function handler(_req: Request, res: Response) {
  try {
    // Mock data for now - replace with actual database queries
    const orders = [
      {
        id: 1,
        customer_name: 'Craft Beer Co.',
        order_date: '2025-12-15',
        status: 'pending',
        total: 2500.00,
        line_items: [
          { id: 1, item_name: 'IPA Keg (1/2 BBL)', qty: 10, price: 150.00 },
          { id: 2, item_name: 'Lager Keg (1/2 BBL)', qty: 10, price: 100.00 },
        ],
        created_at: '2025-12-15T10:00:00Z',
      },
      {
        id: 2,
        customer_name: 'Downtown Pub',
        order_date: '2025-12-16',
        status: 'processing',
        total: 1800.00,
        line_items: [
          { id: 3, item_name: 'Pale Ale Keg (1/2 BBL)', qty: 12, price: 150.00 },
        ],
        created_at: '2025-12-16T09:30:00Z',
      },
      {
        id: 3,
        customer_name: 'Sports Bar & Grill',
        order_date: '2025-12-17',
        status: 'fulfilled',
        total: 3200.00,
        line_items: [
          { id: 4, item_name: 'IPA Keg (1/2 BBL)', qty: 8, price: 150.00 },
          { id: 5, item_name: 'Stout Keg (1/2 BBL)', qty: 8, price: 200.00 },
          { id: 6, item_name: 'Lager Keg (1/2 BBL)', qty: 8, price: 100.00 },
        ],
        created_at: '2025-12-17T11:00:00Z',
      },
    ];

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
