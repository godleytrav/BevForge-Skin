import type { Request, Response } from 'express';
import { db } from '../../db/client';
import { orders, orderLineItems, customers, products } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { status } = req.query;

    // Fetch all orders with customer and line items
    const allOrders = await db.select().from(orders);

    // For each order, fetch customer and line items
    const ordersWithDetails = await Promise.all(
      allOrders.map(async (order) => {
        // Fetch customer
        const [customer] = await db
          .select()
          .from(customers)
          .where(eq(customers.id, order.customerId));

        // Fetch line items with product details
        const lineItems = await db
          .select()
          .from(orderLineItems)
          .where(eq(orderLineItems.orderId, order.id));

        const lineItemsWithProducts = await Promise.all(
          lineItems.map(async (item) => {
            const [product] = await db
              .select()
              .from(products)
              .where(eq(products.id, item.productId));

            return {
              id: item.id,
              product_id: item.productId,
              product_name: product?.name || 'Unknown Product',
              product_sku: product?.sku || '',
              container_type: product?.containerType || '',
              container_size: product?.containerSize || '',
              quantity: item.quantity,
              unit_price: parseFloat(item.unitPrice?.toString() || '0'),
              subtotal: parseFloat(item.subtotal?.toString() || '0'),
              tax: parseFloat(item.tax?.toString() || '0'),
              total: parseFloat(item.total?.toString() || '0'),
              notes: item.notes || '',
            };
          })
        );

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          customer_id: order.customerId,
          customer_name: customer?.name || 'Unknown Customer',
          customer_email: customer?.email || '',
          customer_phone: customer?.phone || '',
          order_date: order.orderDate,
          status: order.status,
          order_source: order.orderSource,
          subtotal: parseFloat(order.subtotal?.toString() || '0'),
          tax: parseFloat(order.tax?.toString() || '0'),
          shipping: parseFloat(order.shipping?.toString() || '0'),
          total: parseFloat(order.total?.toString() || '0'),
          deposit_amount: parseFloat(order.depositAmount?.toString() || '0'),
          deposit_paid: order.depositPaid,
          payment_status: order.paymentStatus,
          payment_method: order.paymentMethod,
          delivery_date: order.deliveryDate,
          delivery_method: order.deliveryMethod,
          delivery_address: order.deliveryAddress,
          delivery_city: order.deliveryCity,
          delivery_state: order.deliveryState,
          delivery_zip_code: order.deliveryZipCode,
          notes: order.notes || '',
          internal_notes: order.internalNotes || '',
          lineItems: lineItemsWithProducts,
          created_at: order.createdAt,
          updated_at: order.updatedAt,
        };
      })
    );

    // Filter by status if provided
    const filteredOrders = status
      ? ordersWithDetails.filter((order) => order.status === status)
      : ordersWithDetails;

    res.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
