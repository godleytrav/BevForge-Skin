/**
 * Control Dataset Seed Script
 * 
 * This script seeds the database with realistic test data:
 * - 3 customers (pre-existing)
 * - 3 products (1 can, 1 bottle, 1 keg)
 * - 3 orders (web, email, phone)
 * 
 * Run with: pnpm tsx src/server/db/seed-control-dataset.ts
 */

import { db } from './client';
import { 
  customers, 
  products, 
  orders, 
  orderLineItems,
  inventory,
  inventoryMovements 
} from './schema';

async function seedControlDataset() {
  console.log('🌱 Starting control dataset seed...\n');

  try {
    // Step 1: Create 3 Customers (Pre-existing)
    console.log('👥 Creating customers...');
    
    const [customer1] = await db.insert(customers).values({
      name: 'Downtown Pub',
      email: 'orders@downtownpub.com',
      phone: '555-0101',
      address: '123 Main Street',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      customerType: 'wholesale',
      status: 'active',
      notes: 'Regular customer, weekly orders',
    }).returning();

    const [customer2] = await db.insert(customers).values({
      name: 'Riverside Restaurant',
      email: 'manager@riversiderest.com',
      phone: '555-0202',
      address: '456 River Road',
      city: 'Portland',
      state: 'OR',
      zipCode: '97202',
      customerType: 'wholesale',
      status: 'active',
      notes: 'Prefers phone orders, delivery on Thursdays',
    }).returning();

    const [customer3] = await db.insert(customers).values({
      name: 'City Bar & Grill',
      email: 'purchasing@citybargrill.com',
      phone: '555-0303',
      address: '789 Downtown Ave',
      city: 'Portland',
      state: 'OR',
      zipCode: '97203',
      customerType: 'wholesale',
      status: 'active',
      notes: 'Email orders only, requires 24hr notice',
    }).returning();

    console.log(`✅ Created 3 customers`);
    console.log(`   - ${customer1.name} (ID: ${customer1.id})`);
    console.log(`   - ${customer2.name} (ID: ${customer2.id})`);
    console.log(`   - ${customer3.name} (ID: ${customer3.id})\n`);

    // Step 2: Create 3 Products (Can, Bottle, Keg)
    console.log('🍺 Creating products...');

    const [product1] = await db.insert(products).values({
      name: 'Hoppy Trail IPA',
      sku: 'IPA-CAN-355',
      description: 'West Coast IPA with citrus and pine notes',
      category: 'beer',
      containerType: 'can',
      containerSize: '355ml',
      unitsPerCase: 24,
      price: 48.00, // $2 per can x 24
      cost: 28.00,
      abv: 6.5,
      ibu: 65,
      status: 'active',
    }).returning();

    const [product2] = await db.insert(products).values({
      name: 'Golden Lager',
      sku: 'LAGER-BTL-330',
      description: 'Crisp, refreshing German-style lager',
      category: 'beer',
      containerType: 'bottle',
      containerSize: '330ml',
      unitsPerCase: 24,
      price: 52.00, // $2.17 per bottle x 24
      cost: 32.00,
      abv: 4.8,
      ibu: 22,
      status: 'active',
    }).returning();

    const [product3] = await db.insert(products).values({
      name: 'Dark Night Stout',
      sku: 'STOUT-KEG-50L',
      description: 'Rich, creamy stout with coffee and chocolate notes',
      category: 'beer',
      containerType: 'keg',
      containerSize: '50L',
      unitsPerCase: 1,
      price: 180.00,
      cost: 110.00,
      abv: 5.2,
      ibu: 35,
      status: 'active',
    }).returning();

    console.log(`✅ Created 3 products`);
    console.log(`   - ${product1.name} (${product1.containerType}, ID: ${product1.id})`);
    console.log(`   - ${product2.name} (${product2.containerType}, ID: ${product2.id})`);
    console.log(`   - ${product3.name} (${product3.containerType}, ID: ${product3.id})\n`);

    // Step 3: Create Inventory Records
    console.log('📦 Creating inventory records...');

    await db.insert(inventory).values([
      {
        productId: product1.id,
        locationId: 1, // Default warehouse
        quantityOnHand: 100, // 100 cases of cans
        quantityReserved: 0,
        quantityAvailable: 100,
        reorderPoint: 20,
        reorderQuantity: 50,
      },
      {
        productId: product2.id,
        locationId: 1,
        quantityOnHand: 80, // 80 cases of bottles
        quantityReserved: 0,
        quantityAvailable: 80,
        reorderPoint: 15,
        reorderQuantity: 40,
      },
      {
        productId: product3.id,
        locationId: 1,
        quantityOnHand: 25, // 25 kegs
        quantityReserved: 0,
        quantityAvailable: 25,
        reorderPoint: 5,
        reorderQuantity: 10,
      },
    ]);

    console.log(`✅ Created inventory records with stock levels\n`);

    // Step 4: Create Order #1 - WEB ORDER (System Generated)
    console.log('🌐 Creating WEB order (system-generated)...');

    const [order1] = await db.insert(orders).values({
      orderNumber: 'WEB-2025-001',
      customerId: customer1.id,
      orderDate: new Date('2024-12-24T09:15:00'),
      status: 'draft', // Needs approval
      orderSource: 'website',
      subtotal: 96.00, // 2 cases x $48
      tax: 8.64, // 9% tax
      shipping: 15.00,
      total: 119.64,
      depositAmount: 0,
      depositPaid: false,
      paymentStatus: 'pending',
      paymentMethod: 'credit_card',
      deliveryDate: new Date('2024-12-26T10:00:00'),
      deliveryMethod: 'delivery',
      deliveryAddress: customer1.address,
      deliveryCity: customer1.city,
      deliveryState: customer1.state,
      deliveryZipCode: customer1.zipCode,
      notes: 'Customer requested morning delivery. Order auto-generated from website.',
      internalNotes: 'System-generated web order - needs approval before fulfillment',
    }).returning();

    await db.insert(orderLineItems).values([
      {
        orderId: order1.id,
        productId: product1.id,
        quantity: 2, // 2 cases
        unitPrice: 48.00,
        subtotal: 96.00,
        tax: 8.64,
        total: 104.64,
        notes: 'Hoppy Trail IPA - 24x355ml cans per case',
      },
    ]);

    console.log(`✅ Created order: ${order1.orderNumber}`);
    console.log(`   - Customer: ${customer1.name}`);
    console.log(`   - Source: Website (system-generated)`);
    console.log(`   - Status: draft (needs approval)`);
    console.log(`   - Total: $${order1.total}`);
    console.log(`   - Items: 2 cases Hoppy Trail IPA (cans)\n`);

    // Step 5: Create Order #2 - PHONE ORDER (Manual Entry)
    console.log('📞 Creating PHONE order (manual entry)...');

    const [order2] = await db.insert(orders).values({
      orderNumber: 'PHONE-2025-001',
      customerId: customer2.id,
      orderDate: new Date('2024-12-24T11:30:00'),
      status: 'draft', // Needs approval
      orderSource: 'phone',
      subtotal: 260.00, // 5 cases x $52
      tax: 23.40, // 9% tax
      shipping: 20.00,
      total: 303.40,
      depositAmount: 0,
      depositPaid: false,
      paymentStatus: 'pending',
      paymentMethod: 'invoice',
      deliveryDate: new Date('2024-12-27T14:00:00'),
      deliveryMethod: 'delivery',
      deliveryAddress: customer2.address,
      deliveryCity: customer2.city,
      deliveryState: customer2.state,
      deliveryZipCode: customer2.zipCode,
      notes: 'Customer called in order. Prefers Thursday afternoon delivery.',
      internalNotes: 'Phone order taken by staff - customer requested NET30 payment terms',
    }).returning();

    await db.insert(orderLineItems).values([
      {
        orderId: order2.id,
        productId: product2.id,
        quantity: 5, // 5 cases
        unitPrice: 52.00,
        subtotal: 260.00,
        tax: 23.40,
        total: 283.40,
        notes: 'Golden Lager - 24x330ml bottles per case',
      },
    ]);

    console.log(`✅ Created order: ${order2.orderNumber}`);
    console.log(`   - Customer: ${customer2.name}`);
    console.log(`   - Source: Phone (manual entry)`);
    console.log(`   - Status: draft (needs approval)`);
    console.log(`   - Total: $${order2.total}`);
    console.log(`   - Items: 5 cases Golden Lager (bottles)\n`);

    // Step 6: Create Order #3 - EMAIL ORDER (Manual Entry)
    console.log('📧 Creating EMAIL order (manual entry)...');

    const [order3] = await db.insert(orders).values({
      orderNumber: 'EMAIL-2025-001',
      customerId: customer3.id,
      orderDate: new Date('2024-12-24T13:45:00'),
      status: 'draft', // Needs approval
      orderSource: 'email',
      subtotal: 284.00, // 1 keg ($180) + 2 cases ($52 x 2)
      tax: 25.56, // 9% tax
      shipping: 25.00,
      total: 334.56,
      depositAmount: 180.00, // Keg deposit
      depositPaid: false,
      paymentStatus: 'pending',
      paymentMethod: 'invoice',
      deliveryDate: new Date('2024-12-25T16:00:00'),
      deliveryMethod: 'delivery',
      deliveryAddress: customer3.address,
      deliveryCity: customer3.city,
      deliveryState: customer3.state,
      deliveryZipCode: customer3.zipCode,
      notes: 'Customer emailed order. Rush delivery requested for Christmas event.',
      internalNotes: 'Email order - customer needs keg for holiday event, priority delivery',
    }).returning();

    await db.insert(orderLineItems).values([
      {
        orderId: order3.id,
        productId: product3.id,
        quantity: 1, // 1 keg
        unitPrice: 180.00,
        subtotal: 180.00,
        tax: 16.20,
        total: 196.20,
        notes: 'Dark Night Stout - 50L keg',
      },
      {
        orderId: order3.id,
        productId: product2.id,
        quantity: 2, // 2 cases
        unitPrice: 52.00,
        subtotal: 104.00,
        tax: 9.36,
        total: 113.36,
        notes: 'Golden Lager - 24x330ml bottles per case',
      },
    ]);

    console.log(`✅ Created order: ${order3.orderNumber}`);
    console.log(`   - Customer: ${customer3.name}`);
    console.log(`   - Source: Email (manual entry)`);
    console.log(`   - Status: draft (needs approval)`);
    console.log(`   - Total: $${order3.total} (includes $${order3.depositAmount} keg deposit)`);
    console.log(`   - Items: 1 keg Dark Night Stout + 2 cases Golden Lager (bottles)\n`);

    // Summary
    console.log('✅ Control dataset seed complete!\n');
    console.log('📊 Summary:');
    console.log('   - 3 customers created');
    console.log('   - 3 products created (can, bottle, keg)');
    console.log('   - 3 orders created (web, phone, email)');
    console.log('   - All orders in "draft" status (need approval)');
    console.log('   - Inventory stocked and ready\n');
    console.log('🎯 Next steps:');
    console.log('   1. Hard refresh your browser');
    console.log('   2. Go to /ops/orders');
    console.log('   3. Review and approve orders');
    console.log('   4. Test full workflow from draft → delivered\n');

  } catch (error) {
    console.error('❌ Error seeding control dataset:', error);
    throw error;
  }
}

// Run the seed
seedControlDataset()
  .then(() => {
    console.log('✅ Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
