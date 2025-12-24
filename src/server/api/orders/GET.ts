import type { Request, Response } from 'express';

/**
 * GET /api/orders
 * Fetch all orders with line items
 * Query params:
 *   - status: Filter by order status (draft, confirmed, approved, in-packing, packed, loaded, in-delivery, delivered, cancelled)
 * 
 * NOTE: This endpoint returns CONTROL DATASET for testing.
 * In production, this would query the database.
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { status } = req.query;

    // CONTROL DATASET - 3 test orders simulating web, phone, and email sources
    const allOrders = [
      // Order #1: Web Order (System Generated) - DRAFT
      {
        id: 'ORD-WEB-001',
        orderNumber: 'WEB-2025-001',
        customerId: 'CUST-001',
        customer_name: 'Downtown Pub',
        customer_contact: 'Mike Johnson',
        customer_phone: '(555) 123-4567',
        customer_email: 'mike@downtownpub.com',
        status: 'draft',
        order_date: '2025-12-24T08:00:00Z',
        delivery_date: '2025-12-26T10:00:00Z',
        total_amount: 360.00,
        deposit_amount: 100.00,
        source: 'web',
        lineItems: [
          {
            id: 'LINE-WEB-001',
            productId: 'PROD-001',
            product_name: 'Hoppy Trail IPA',
            containerTypeId: 'KEG-50L',
            container_type: '50L Keg',
            quantity: 2,
            unitPrice: 180.00,
            depositPerUnit: 50.00,
            totalPrice: 360.00,
            totalDeposit: 100.00,
          },
        ],
        notes: 'Automated web order - requires approval',
        createdAt: '2025-12-24T08:00:00Z',
        updatedAt: '2025-12-24T08:00:00Z',
      },
      
      // Order #2: Phone Order (Manual Entry) - CONFIRMED
      {
        id: 'ORD-PHONE-001',
        orderNumber: 'PHONE-2025-001',
        customerId: 'CUST-002',
        customer_name: 'Riverside Restaurant',
        customer_contact: 'Sarah Chen',
        customer_phone: '(555) 234-5678',
        customer_email: 'sarah@riverside.com',
        status: 'confirmed',
        order_date: '2025-12-24T09:30:00Z',
        delivery_date: '2025-12-27T14:00:00Z',
        total_amount: 240.00,
        deposit_amount: 0.00,
        source: 'phone',
        lineItems: [
          {
            id: 'LINE-PHONE-001',
            productId: 'PROD-002',
            product_name: 'Golden Lager',
            containerTypeId: 'CASE-24',
            container_type: 'Case (24x330ml)',
            quantity: 5,
            unitPrice: 48.00,
            depositPerUnit: 0.00,
            totalPrice: 240.00,
            totalDeposit: 0.00,
          },
        ],
        notes: 'Phone order from manager - confirmed delivery time',
        createdAt: '2025-12-24T09:30:00Z',
        updatedAt: '2025-12-24T09:30:00Z',
      },
      
      // Order #3: Email Order (Manual Entry) - APPROVED
      {
        id: 'ORD-EMAIL-001',
        orderNumber: 'EMAIL-2025-001',
        customerId: 'CUST-003',
        customer_name: 'City Bar & Grill',
        customer_contact: 'Tom Martinez',
        customer_phone: '(555) 345-6789',
        customer_email: 'tom@citybargrill.com',
        status: 'approved',
        order_date: '2025-12-24T10:15:00Z',
        delivery_date: '2025-12-25T16:00:00Z',
        total_amount: 216.00,
        deposit_amount: 50.00,
        source: 'email',
        lineItems: [
          {
            id: 'LINE-EMAIL-001',
            productId: 'PROD-003',
            product_name: 'Dark Night Stout',
            containerTypeId: 'KEG-30L',
            container_type: '30L Keg',
            quantity: 1,
            unitPrice: 120.00,
            depositPerUnit: 50.00,
            totalPrice: 120.00,
            totalDeposit: 50.00,
          },
          {
            id: 'LINE-EMAIL-002',
            productId: 'PROD-002',
            product_name: 'Golden Lager',
            containerTypeId: 'CASE-24',
            container_type: 'Case (24x330ml)',
            quantity: 2,
            unitPrice: 48.00,
            depositPerUnit: 0.00,
            totalPrice: 96.00,
            totalDeposit: 0.00,
          },
        ],
        notes: 'Email order - urgent delivery for Christmas event',
        createdAt: '2025-12-24T10:15:00Z',
        updatedAt: '2025-12-24T10:15:00Z',
      },
    ];

    // Filter by status if provided
    const filteredOrders = status 
      ? allOrders.filter(order => order.status === status)
      : allOrders;

    res.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
