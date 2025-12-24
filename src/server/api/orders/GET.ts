import type { Request, Response } from 'express';

/**
 * GET /api/orders
 * Fetch all orders with line items
 * Query params:
 *   - status: Filter by order status (draft, confirmed, approved, in-packing, packed, loaded, in-delivery, delivered, cancelled)
 */
export default async function handler(req: Request, res: Response) {
  try {
    const { status } = req.query;

    // Mock data for testing - matches logistics workflow
    const allOrders = [
      {
        id: 'ORD-001',
        orderNumber: 'ORD-001',
        customerId: 'CUST-001',
        customer_name: "Joe's Bar",
        status: 'approved',
        order_date: '2025-12-20T10:00:00Z',
        delivery_date: '2025-12-24T14:00:00Z',
        total_amount: 450.00,
        deposit_amount: 150.00,
        lineItems: [
          { 
            id: 'LINE-001', 
            productId: 'PROD-IPA',
            productName: 'IPA', 
            containerTypeId: 'KEG-HALF',
            containerType: 'Keg (1/2 BBL)',
            quantity: 3,
            unitPrice: 150.00,
            depositPerUnit: 50.00,
            totalPrice: 450.00,
            totalDeposit: 150.00
          },
        ],
        notes: 'Regular weekly delivery',
        createdAt: '2025-12-20T10:00:00Z',
        updatedAt: '2025-12-20T10:00:00Z',
      },
      {
        id: 'ORD-002',
        orderNumber: 'ORD-002',
        customerId: 'CUST-002',
        customer_name: 'Main St Pub',
        status: 'approved',
        order_date: '2025-12-20T11:00:00Z',
        delivery_date: '2025-12-24T15:00:00Z',
        total_amount: 750.00,
        deposit_amount: 250.00,
        lineItems: [
          { 
            id: 'LINE-002', 
            productId: 'PROD-LAGER',
            productName: 'Lager', 
            containerTypeId: 'KEG-HALF',
            containerType: 'Keg (1/2 BBL)',
            quantity: 5,
            unitPrice: 150.00,
            depositPerUnit: 50.00,
            totalPrice: 750.00,
            totalDeposit: 250.00
          },
        ],
        notes: 'Urgent - event this weekend',
        createdAt: '2025-12-20T11:00:00Z',
        updatedAt: '2025-12-20T11:00:00Z',
      },
      {
        id: 'ORD-003',
        orderNumber: 'ORD-003',
        customerId: 'CUST-003',
        customer_name: 'Downtown Pub',
        status: 'approved',
        order_date: '2025-12-20T12:00:00Z',
        delivery_date: '2025-12-24T16:00:00Z',
        total_amount: 650.00,
        deposit_amount: 150.00,
        lineItems: [
          { 
            id: 'LINE-003', 
            productId: 'PROD-IPA',
            productName: 'IPA', 
            containerTypeId: 'KEG-HALF',
            containerType: 'Keg (1/2 BBL)',
            quantity: 3,
            unitPrice: 150.00,
            depositPerUnit: 50.00,
            totalPrice: 450.00,
            totalDeposit: 150.00
          },
          { 
            id: 'LINE-004', 
            productId: 'PROD-IPA',
            productName: 'IPA Cans', 
            containerTypeId: 'CASE-24',
            containerType: 'Case (24 cans)',
            quantity: 2,
            unitPrice: 100.00,
            depositPerUnit: 0.00,
            totalPrice: 200.00,
            totalDeposit: 0.00
          },
        ],
        notes: 'Mix of kegs and cases',
        createdAt: '2025-12-20T12:00:00Z',
        updatedAt: '2025-12-20T12:00:00Z',
      },
      {
        id: 'ORD-004',
        orderNumber: 'ORD-004',
        customerId: 'CUST-004',
        customer_name: 'Sports Bar',
        status: 'draft',
        order_date: '2025-12-23T09:00:00Z',
        delivery_date: '2025-12-26T14:00:00Z',
        total_amount: 900.00,
        deposit_amount: 300.00,
        lineItems: [
          { 
            id: 'LINE-005', 
            productId: 'PROD-LAGER',
            productName: 'Lager', 
            containerTypeId: 'KEG-HALF',
            containerType: 'Keg (1/2 BBL)',
            quantity: 6,
            unitPrice: 150.00,
            depositPerUnit: 50.00,
            totalPrice: 900.00,
            totalDeposit: 300.00
          },
        ],
        notes: 'Pending approval',
        createdAt: '2025-12-23T09:00:00Z',
        updatedAt: '2025-12-23T09:00:00Z',
      },
      {
        id: 'ORD-005',
        orderNumber: 'ORD-005',
        customerId: 'CUST-001',
        customer_name: "Joe's Bar",
        status: 'delivered',
        order_date: '2025-12-15T10:00:00Z',
        delivery_date: '2025-12-18T14:00:00Z',
        total_amount: 450.00,
        deposit_amount: 150.00,
        lineItems: [
          { 
            id: 'LINE-006', 
            productId: 'PROD-IPA',
            productName: 'IPA', 
            containerTypeId: 'KEG-HALF',
            containerType: 'Keg (1/2 BBL)',
            quantity: 3,
            unitPrice: 150.00,
            depositPerUnit: 50.00,
            totalPrice: 450.00,
            totalDeposit: 150.00
          },
        ],
        notes: 'Completed last week',
        createdAt: '2025-12-15T10:00:00Z',
        updatedAt: '2025-12-18T16:00:00Z',
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
