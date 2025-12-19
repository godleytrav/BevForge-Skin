import type { Request, Response } from 'express';

/**
 * PATCH /api/orders/:orderId
 * Update an existing order
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const { customer_name, order_date, status, line_items, total } = req.body;

    // Mock update - replace with actual database update
    const updatedOrder = {
      id: parseInt(orderId),
      customer_name,
      order_date,
      status,
      total,
      line_items,
      created_at: new Date().toISOString(),
    };

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      error: 'Failed to update order',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
