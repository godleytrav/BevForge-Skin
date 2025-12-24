import { mysqlSchema } from 'drizzle-orm/mysql-core';
import { mysqlTable, varchar, int, decimal, datetime, boolean, text, mysqlEnum } from 'drizzle-orm/mysql-core';

export const appSchema = mysqlSchema(process.env.MYSQL_DATABASE || 'appdb');

// Location Types
export const locations = mysqlTable('locations', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['warehouse', 'truck', 'customer', 'production', 'cleaning']).notNull(),
  capacity: int('capacity'), // For trucks: pallet capacity
  capacityCases: int('capacity_cases'), // For trucks: case capacity
  address: text('address'),
  contactName: varchar('contact_name', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Products (Master Data)
export const products = mysqlTable('products', {
  id: varchar('id', { length: 50 }).primaryKey(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  productType: mysqlEnum('product_type', ['beer', 'cider', 'seltzer', 'non_alcoholic', 'wine', 'spirits', 'other']).notNull(),
  style: varchar('style', { length: 100 }), // IPA, Lager, Stout, etc.
  abv: decimal('abv', { precision: 4, scale: 2 }), // Alcohol by Volume %
  ibu: int('ibu'), // International Bitterness Units
  srm: int('srm'), // Color (Standard Reference Method)
  description: text('description'),
  tastingNotes: text('tasting_notes'),
  ingredients: text('ingredients'),
  recipeId: varchar('recipe_id', { length: 50 }),
  status: mysqlEnum('status', ['active', 'discontinued', 'seasonal', 'draft']).default('active'),
  imageUrl: varchar('image_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Product Variants (Package Types)
export const productVariants = mysqlTable('product_variants', {
  id: varchar('id', { length: 50 }).primaryKey(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  containerTypeId: varchar('container_type_id', { length: 50 }).notNull(),
  variantSku: varchar('variant_sku', { length: 100 }).notNull().unique(),
  barcode: varchar('barcode', { length: 100 }),
  size: varchar('size', { length: 50 }).notNull(), // "50L", "330ml", "12oz", etc.
  unitOfMeasure: mysqlEnum('unit_of_measure', ['liters', 'gallons', 'milliliters', 'ounces']).notNull(),
  packSize: varchar('pack_size', { length: 50 }), // "Single", "6-pack", "12-pack", "Case", etc.
  unitsPerCase: int('units_per_case'), // 24 bottles, 12 cans, etc.
  wholesalePrice: decimal('wholesale_price', { precision: 10, scale: 2 }),
  retailPrice: decimal('retail_price', { precision: 10, scale: 2 }),
  taproomPrice: decimal('taproom_price', { precision: 10, scale: 2 }),
  productionCost: decimal('production_cost', { precision: 10, scale: 2 }),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  weight: decimal('weight', { precision: 10, scale: 2 }), // For shipping
  isActive: boolean('is_active').default(true),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Inventory (Stock Levels)
export const inventory = mysqlTable('inventory', {
  id: varchar('id', { length: 50 }).primaryKey(),
  variantId: varchar('variant_id', { length: 50 }).notNull(),
  locationId: varchar('location_id', { length: 50 }).notNull(),
  quantityOnHand: int('quantity_on_hand').default(0),
  quantityAllocated: int('quantity_allocated').default(0), // Reserved for orders
  quantityAvailable: int('quantity_available').default(0), // On hand - allocated
  quantityInProduction: int('quantity_in_production').default(0),
  minStockLevel: int('min_stock_level').default(0), // Reorder point
  maxStockLevel: int('max_stock_level').default(0), // Storage capacity
  reorderQuantity: int('reorder_quantity').default(0),
  lastCountedAt: datetime('last_counted_at'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Batches (Production Tracking)
export const batches = mysqlTable('batches', {
  id: varchar('id', { length: 50 }).primaryKey(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  batchNumber: varchar('batch_number', { length: 100 }).notNull().unique(),
  brewDate: datetime('brew_date'),
  packageDate: datetime('package_date'),
  bestByDate: datetime('best_by_date'),
  expirationDate: datetime('expiration_date'),
  batchSizeGallons: decimal('batch_size_gallons', { precision: 10, scale: 2 }),
  yieldExpected: decimal('yield_expected', { precision: 10, scale: 2 }),
  yieldActual: decimal('yield_actual', { precision: 10, scale: 2 }),
  brewerName: varchar('brewer_name', { length: 255 }),
  tankNumber: varchar('tank_number', { length: 50 }),
  qualityStatus: mysqlEnum('quality_status', ['pending', 'passed', 'failed', 'quarantine']).default('pending'),
  status: mysqlEnum('status', ['active', 'depleted', 'quarantine', 'archived']).default('active'),
  notes: text('notes'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Container Types
export const containerTypes = mysqlTable('container_types', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: mysqlEnum('category', ['keg', 'case', 'bottle', 'can', 'sixpack', 'pallet']).notNull(),
  volumeGallons: decimal('volume_gallons', { precision: 10, scale: 4 }),
  capacity: int('capacity'), // For pallets: nominal capacity
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  isReturnable: boolean('is_returnable').default(false),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Containers (kegs, cases, bottles, etc.)
export const containers = mysqlTable('containers', {
  id: varchar('id', { length: 50 }).primaryKey(),
  containerTypeId: varchar('container_type_id', { length: 50 }).notNull(),
  productId: varchar('product_id', { length: 50 }),
  batchId: varchar('batch_id', { length: 50 }),
  serialNumber: varchar('serial_number', { length: 100 }),
  qrCode: varchar('qr_code', { length: 255 }),
  status: mysqlEnum('status', [
    'empty',
    'filled',
    'in_transit',
    'at_customer',
    'returned',
    'cleaning',
    'maintenance',
    'condemned'
  ]).default('empty'),
  currentLocationId: varchar('current_location_id', { length: 50 }),
  palletId: varchar('pallet_id', { length: 50 }),
  fillDate: datetime('fill_date'),
  deliveryDate: datetime('delivery_date'),
  expectedReturnDate: datetime('expected_return_date'),
  actualReturnDate: datetime('actual_return_date'),
  lastCleanedDate: datetime('last_cleaned_date'),
  lastInspectedDate: datetime('last_inspected_date'),
  condition: mysqlEnum('condition', ['good', 'damaged', 'needs_maintenance']).default('good'),
  notes: text('notes'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Pallets
export const pallets = mysqlTable('pallets', {
  id: varchar('id', { length: 50 }).primaryKey(),
  palletNumber: varchar('pallet_number', { length: 100 }).notNull(),
  containerTypeId: varchar('container_type_id', { length: 50 }).notNull(), // Pallet type
  currentLocationId: varchar('current_location_id', { length: 50 }),
  deliveryId: varchar('delivery_id', { length: 50 }),
  status: mysqlEnum('status', ['empty', 'partial', 'full', 'in_transit', 'at_customer']).default('empty'),
  isMixed: boolean('is_mixed').default(false),
  isReturnable: boolean('is_returnable').default(true),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Container Movements (audit trail)
export const containerMovements = mysqlTable('container_movements', {
  id: varchar('id', { length: 50 }).primaryKey(),
  containerId: varchar('container_id', { length: 50 }).notNull(),
  fromLocationId: varchar('from_location_id', { length: 50 }),
  toLocationId: varchar('to_location_id', { length: 50 }).notNull(),
  movementType: mysqlEnum('movement_type', [
    'fill',
    'load',
    'deliver',
    'return',
    'clean',
    'maintenance',
    'transfer'
  ]).notNull(),
  deliveryId: varchar('delivery_id', { length: 50 }),
  orderId: varchar('order_id', { length: 50 }),
  performedBy: varchar('performed_by', { length: 255 }),
  notes: text('notes'),
  timestamp: datetime('timestamp').notNull(),
  createdAt: datetime('created_at').notNull(),
});

// Pallet Movements
export const palletMovements = mysqlTable('pallet_movements', {
  id: varchar('id', { length: 50 }).primaryKey(),
  palletId: varchar('pallet_id', { length: 50 }).notNull(),
  fromLocationId: varchar('from_location_id', { length: 50 }),
  toLocationId: varchar('to_location_id', { length: 50 }).notNull(),
  movementType: mysqlEnum('movement_type', ['load', 'deliver', 'return', 'transfer']).notNull(),
  deliveryId: varchar('delivery_id', { length: 50 }),
  performedBy: varchar('performed_by', { length: 255 }),
  notes: text('notes'),
  timestamp: datetime('timestamp').notNull(),
  createdAt: datetime('created_at').notNull(),
});

// Deliveries
export const deliveries = mysqlTable('deliveries', {
  id: varchar('id', { length: 50 }).primaryKey(),
  deliveryNumber: varchar('delivery_number', { length: 100 }).notNull(),
  truckId: varchar('truck_id', { length: 50 }).notNull(), // References locations table
  driverId: varchar('driver_id', { length: 50 }),
  status: mysqlEnum('status', [
    'scheduled',
    'loading',
    'in_transit',
    'completed',
    'cancelled'
  ]).default('scheduled'),
  scheduledDate: datetime('scheduled_date').notNull(),
  departureTime: datetime('departure_time'),
  completionTime: datetime('completion_time'),
  notes: text('notes'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Delivery Stops
export const deliveryStops = mysqlTable('delivery_stops', {
  id: varchar('id', { length: 50 }).primaryKey(),
  deliveryId: varchar('delivery_id', { length: 50 }).notNull(),
  customerId: varchar('customer_id', { length: 50 }).notNull(), // References locations table
  orderId: varchar('order_id', { length: 50 }),
  stopOrder: int('stop_order').notNull(),
  status: mysqlEnum('status', ['pending', 'in_progress', 'completed', 'skipped']).default('pending'),
  arrivalTime: datetime('arrival_time'),
  departureTime: datetime('departure_time'),
  signatureName: varchar('signature_name', { length: 255 }),
  signatureData: text('signature_data'), // Base64 encoded signature
  notes: text('notes'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Orders
export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 50 }).primaryKey(),
  orderNumber: varchar('order_number', { length: 100 }).notNull(),
  customerId: varchar('customer_id', { length: 50 }).notNull(), // References locations table
  status: mysqlEnum('status', [
    'draft',
    'confirmed',
    'approved',
    'in-packing',
    'packed',
    'loaded',
    'in-delivery',
    'delivered',
    'cancelled'
  ]).default('draft'),
  orderDate: datetime('order_date').notNull(),
  deliveryDate: datetime('delivery_date'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  notes: text('notes'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Order Line Items
export const orderLineItems = mysqlTable('order_line_items', {
  id: varchar('id', { length: 50 }).primaryKey(),
  orderId: varchar('order_id', { length: 50 }).notNull(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  containerTypeId: varchar('container_type_id', { length: 50 }).notNull(),
  quantity: int('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  depositPerUnit: decimal('deposit_per_unit', { precision: 10, scale: 2 }),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  totalDeposit: decimal('total_deposit', { precision: 10, scale: 2 }),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
});

// Customer Deposits (tracking deposit balances)
export const customerDeposits = mysqlTable('customer_deposits', {
  id: varchar('id', { length: 50 }).primaryKey(),
  customerId: varchar('customer_id', { length: 50 }).notNull(),
  containerTypeId: varchar('container_type_id', { length: 50 }).notNull(),
  quantityOut: int('quantity_out').default(0), // Containers at customer
  quantityReturned: int('quantity_returned').default(0),
  depositBalance: decimal('deposit_balance', { precision: 10, scale: 2 }).default('0.00'),
  lastUpdated: datetime('last_updated').notNull(),
  createdAt: datetime('created_at').notNull(),
});

// Alerts
export const alerts = mysqlTable('alerts', {
  id: varchar('id', { length: 50 }).primaryKey(),
  type: mysqlEnum('type', [
    'overdue_return',
    'low_inventory',
    'over_capacity',
    'needs_maintenance',
    'deposit_imbalance',
    'compliance_deadline'
  ]).notNull(),
  severity: mysqlEnum('severity', ['info', 'warning', 'error', 'critical']).default('warning'),
  entityType: varchar('entity_type', { length: 50 }), // 'container', 'pallet', 'customer', etc.
  entityId: varchar('entity_id', { length: 50 }),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  isResolved: boolean('is_resolved').default(false),
  createdAt: datetime('created_at').notNull(),
  resolvedAt: datetime('resolved_at'),
});
