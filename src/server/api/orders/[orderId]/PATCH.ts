import type { Request, Response } from 'express';

/**
 * PATCH /api/orders/:orderId
 * Update order details or status
 * 
 * Body can include:
 *   - status: Update order status
 *   - notes: Update order notes
 *   - deliveryDate: Update delivery date
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const updates = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Validate status if provided
    const validStatuses = [
      'draft',
      'confirmed',
      'approved',
      'in-packing',
      'packed',
      'loaded',
      'in-delivery',
      'delivered',
      'cancelled'
    ];

    if (updates.status && !validStatuses.includes(updates.status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        validStatuses 
      });
    }

    // Mock update - in production, this would update the database
    const updatedOrder = {
      id: orderId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    console.log(`Order ${orderId} updated:`, updates);

    res.json({
      success: true,
      order: updatedOrder,
      message: `Order ${orderId} updated successfully`
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      error: 'Failed to update order',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
