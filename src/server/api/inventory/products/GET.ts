import type { Request, Response } from 'express';
import { db } from '../../../db/client';
import { products, inventory } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    // Fetch all products
    const allProducts = await db.select().from(products);

    // For each product, fetch inventory levels
    const productsWithInventory = await Promise.all(
      allProducts.map(async (product) => {
        const [inventoryRecord] = await db
          .select()
          .from(inventory)
          .where(eq(inventory.productId, product.id));

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          description: product.description || '',
          category: product.category,
          container_type: product.containerType,
          container_size: product.containerSize,
          units_per_case: product.unitsPerCase,
          price: parseFloat(product.price?.toString() || '0'),
          cost: parseFloat(product.cost?.toString() || '0'),
          abv: product.abv ? parseFloat(product.abv.toString()) : null,
          ibu: product.ibu || null,
          status: product.status,
          quantity_on_hand: inventoryRecord?.quantityOnHand || 0,
          quantity_reserved: inventoryRecord?.quantityReserved || 0,
          quantity_available: inventoryRecord?.quantityAvailable || 0,
          reorder_point: inventoryRecord?.reorderPoint || 0,
          reorder_quantity: inventoryRecord?.reorderQuantity || 0,
          created_at: product.createdAt,
          updated_at: product.updatedAt,
        };
      })
    );

    res.json(productsWithInventory);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
