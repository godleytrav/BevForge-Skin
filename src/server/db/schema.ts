import { mysqlTable, int, varchar, text, decimal, timestamp, boolean, json, index, primaryKey } from 'drizzle-orm/mysql-core';

// ============================================================================
// UNITS OF MEASURE
// ============================================================================

export const unitsOfMeasure = mysqlTable('units_of_measure', {
  id: int('id').primaryKey().autoincrement(),
  code: varchar('code', { length: 20 }).notNull().unique(), // gal, L, lb, kg, bbl, oz, etc.
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // volume, weight, count
  baseUnit: varchar('base_unit', { length: 20 }), // Reference to base unit for conversions
  conversionFactor: decimal('conversion_factor', { precision: 20, scale: 10 }), // Factor to convert to base unit
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ============================================================================
// LOCATIONS (Hierarchical)
// ============================================================================

export const locations = mysqlTable('locations', {
  id: int('id').primaryKey().autoincrement(),
  code: varchar('code', { length: 50 }).notNull().unique(), // Alphanumeric: "WH1-A-12-3"
  name: varchar('name', { length: 255 }).notNull(),
  parentId: int('parent_id'), // Self-reference for hierarchy
  locationType: varchar('location_type', { length: 50 }).notNull(), // warehouse, zone, aisle, shelf, bin, rack, barrel
  level: int('level').notNull().default(0), // 0=warehouse, 1=zone, 2=aisle, etc.
  capacity: decimal('capacity', { precision: 15, scale: 4 }), // Optional capacity
  capacityUom: varchar('capacity_uom', { length: 20 }), // Unit for capacity
  isActive: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  parentIdx: index('parent_idx').on(table.parentId),
  typeIdx: index('type_idx').on(table.locationType),
}));

// ============================================================================
// ITEMS (Materials, Ingredients, Packaging, Finished Goods)
// ============================================================================

export const items = mysqlTable('items', {
  id: int('id').primaryKey().autoincrement(),
  itemCode: varchar('item_code', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(), // yeast, malt, hops, fruit, additive, packaging, finished_good
  subcategory: varchar('subcategory', { length: 100 }), // ale_yeast, base_malt, aroma_hops, etc.
  
  // Inventory control
  trackLots: boolean('track_lots').notNull().default(true),
  defaultUom: varchar('default_uom', { length: 20 }).notNull(), // Primary unit
  alternateUom: varchar('alternate_uom', { length: 20 }), // Secondary unit
  conversionFactor: decimal('conversion_factor', { precision: 20, scale: 10 }), // Alternate to default
  
  // Costing (OS owns last cost for production planning)
  lastCost: decimal('last_cost', { precision: 15, scale: 4 }),
  costUom: varchar('cost_uom', { length: 20 }),
  
  // Reorder (basic - OPS extends this)
  reorderPoint: decimal('reorder_point', { precision: 15, scale: 4 }),
  reorderQty: decimal('reorder_qty', { precision: 15, scale: 4 }),
  
  // Category-specific data (JSON for flexibility)
  // Yeast fields
  yeastData: json('yeast_data').$type<{
    manufacturer?: string;
    strainCode?: string;
    strainName?: string;
    yeastFamily?: 'ale' | 'lager' | 'wine' | 'cider';
    form?: 'dry' | 'liquid';
    attenuationMinPct?: number;
    attenuationMaxPct?: number;
    alcoholTolerancePct?: number;
    tempRangeCMin?: number;
    tempRangeCMax?: number;
    flocculation?: 'low' | 'med' | 'high';
    fermentationSpeed?: 'slow' | 'med' | 'fast';
    preferredSugars?: string[];
    sorbitolNonfermentable?: boolean;
    glycerolProduction?: 'low' | 'med' | 'high';
    h2sRisk?: 'low' | 'med' | 'high';
    esterProfile?: string[];
    phenolProfile?: string[];
    mouthfeelEffect?: 'thin' | 'neutral' | 'round';
    aromaticIntensity?: number; // 1-5
    nutrientDemand?: 'low' | 'med' | 'high';
    rehydrationRequired?: boolean;
    killerFactor?: boolean;
  }>(),
  
  // Malt/Grain fields
  maltData: json('malt_data').$type<{
    grainType?: string;
    maltster?: string;
    origin?: string;
    ppg?: number; // Points per pound per gallon
    extractYieldPct?: number;
    moisturePct?: number;
    fermentability?: 'low' | 'med' | 'high';
    dextrinContribution?: 'low' | 'med' | 'high';
    colorLovibond?: number;
    bodyContribution?: number; // 1-5
    headRetentionEffect?: string;
    flavorNotes?: string[];
    sweetnessContribution?: number; // 1-5
    toastRoastLevel?: string;
  }>(),
  
  // Hops fields
  hopsData: json('hops_data').$type<{
    variety?: string;
    origin?: string;
    harvestYear?: number;
    alphaAcidPct?: number;
    betaAcidPct?: number;
    oilTotalMl100g?: number;
    oilBreakdown?: Record<string, number>; // myrcene, humulene, etc.
    aromaDescriptors?: string[];
    flavorDescriptors?: string[];
    perceivedBitternessQuality?: 'soft' | 'sharp' | 'resinous';
    storageIndex?: number;
    oxidationSensitivity?: string;
  }>(),
  
  // Fruit/Juice fields
  fruitData: json('fruit_data').$type<{
    glucosePct?: number;
    fructosePct?: number;
    sucrosePct?: number;
    sorbitolPct?: number;
    totalSugarGL?: number;
    brix?: number;
    phMin?: number;
    phMax?: number;
    taGLMin?: number;
    taGLMax?: number;
    dominantAcid?: string;
    polyphenolIndex?: number;
    tanninLevel?: 'low' | 'med' | 'high';
    pectinLevel?: string;
    yanMgLMin?: number;
    yanMgLMax?: number;
    clarified?: boolean;
    pasteurized?: boolean;
    concentrate?: boolean;
    harvestVarianceRating?: string;
    sourceVarianceRating?: string;
  }>(),
  
  // Additive fields
  additiveData: json('additive_data').$type<{
    functionalRole?: 'acid' | 'tannin' | 'nutrient' | 'enzyme' | 'fining' | 'other';
    effectiveRangeMin?: number;
    effectiveRangeMax?: number;
    activeCompound?: string;
    solubility?: string;
    reactionTime?: string;
    primaryEffect?: string;
    secondaryEffect?: string;
    overuseRisk?: string;
  }>(),
  
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  categoryIdx: index('category_idx').on(table.category),
  codeIdx: index('code_idx').on(table.itemCode),
}));

// ============================================================================
// LOTS (Traceability)
// ============================================================================

export const lots = mysqlTable('lots', {
  id: int('id').primaryKey().autoincrement(),
  itemId: int('item_id').notNull(),
  lotNumber: varchar('lot_number', { length: 100 }).notNull(),
  supplierLotRef: varchar('supplier_lot_ref', { length: 100 }),
  receivedDate: timestamp('received_date'),
  expirationDate: timestamp('expiration_date'),
  bestBeforeDate: timestamp('best_before_date'),
  manufacturingDate: timestamp('manufacturing_date'),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  itemIdx: index('item_idx').on(table.itemId),
  lotIdx: index('lot_idx').on(table.lotNumber),
}));

// ============================================================================
// INVENTORY LEDGER (Canonical Movement Log)
// ============================================================================

export const inventoryLedger = mysqlTable('inventory_ledger', {
  id: int('id').primaryKey().autoincrement(),
  transactionDate: timestamp('transaction_date').notNull().defaultNow(),
  transactionType: varchar('transaction_type', { length: 50 }).notNull(), // receipt, consumption, production, transfer, adjustment, waste
  itemId: int('item_id').notNull(),
  lotId: int('lot_id'),
  locationId: int('location_id').notNull(),
  quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull(), // Positive = in, Negative = out
  uom: varchar('uom', { length: 20 }).notNull(),
  
  // References
  batchId: int('batch_id'), // If related to batch
  transferId: int('transfer_id'), // If related to transfer
  referenceDoc: varchar('reference_doc', { length: 100 }), // PO#, SO#, etc. (OPS will use this)
  
  // Cost tracking (for COGS calculation)
  unitCost: decimal('unit_cost', { precision: 15, scale: 4 }),
  totalCost: decimal('total_cost', { precision: 15, scale: 4 }),
  
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  itemIdx: index('item_idx').on(table.itemId),
  locationIdx: index('location_idx').on(table.locationId),
  batchIdx: index('batch_idx').on(table.batchId),
  dateIdx: index('date_idx').on(table.transactionDate),
  typeIdx: index('type_idx').on(table.transactionType),
}));

// ============================================================================
// INVENTORY BALANCES (Current State - Derived from Ledger)
// ============================================================================

export const inventoryBalances = mysqlTable('inventory_balances', {
  itemId: int('item_id').notNull(),
  lotId: int('lot_id'),
  locationId: int('location_id').notNull(),
  quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull().default('0'),
  uom: varchar('uom', { length: 20 }).notNull(),
  lastMovement: timestamp('last_movement'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.itemId, table.locationId, table.lotId] }),
  itemIdx: index('item_idx').on(table.itemId),
  locationIdx: index('location_idx').on(table.locationId),
}));

// ============================================================================
// BATCHES (Production Runs)
// ============================================================================

export const batches = mysqlTable('batches', {
  id: int('id').primaryKey().autoincrement(),
  batchNumber: varchar('batch_number', { length: 100 }).notNull().unique(),
  batchName: varchar('batch_name', { length: 255 }).notNull(),
  recipeId: int('recipe_id'), // Reference to LAB recipe (when LAB installed)
  productItemId: int('product_item_id'), // What finished good this produces
  
  status: varchar('status', { length: 50 }).notNull().default('planned'), // planned, in_progress, fermenting, conditioning, packaging, completed, cancelled
  
  // Volumes
  plannedVolume: decimal('planned_volume', { precision: 15, scale: 4 }),
  actualVolume: decimal('actual_volume', { precision: 15, scale: 4 }),
  volumeUom: varchar('volume_uom', { length: 20 }),
  
  // Gravity readings
  originalGravity: decimal('original_gravity', { precision: 6, scale: 4 }),
  finalGravity: decimal('final_gravity', { precision: 6, scale: 4 }),
  
  // Dates
  startDate: timestamp('start_date'),
  brewDate: timestamp('brew_date'),
  fermentationStartDate: timestamp('fermentation_start_date'),
  fermentationEndDate: timestamp('fermentation_end_date'),
  packagingDate: timestamp('packaging_date'),
  completedDate: timestamp('completed_date'),
  
  // Location tracking
  currentLocationId: int('current_location_id'), // Current vessel/tank
  
  // Costing
  totalCost: decimal('total_cost', { precision: 15, scale: 4 }),
  costPerUnit: decimal('cost_per_unit', { precision: 15, scale: 4 }),
  
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  statusIdx: index('status_idx').on(table.status),
  productIdx: index('product_idx').on(table.productItemId),
  locationIdx: index('location_idx').on(table.currentLocationId),
}));

// ============================================================================
// BATCH MATERIALS (Planned vs Actual Usage)
// ============================================================================

export const batchMaterials = mysqlTable('batch_materials', {
  id: int('id').primaryKey().autoincrement(),
  batchId: int('batch_id').notNull(),
  itemId: int('item_id').notNull(),
  lotId: int('lot_id'),
  
  // Planned
  plannedQuantity: decimal('planned_quantity', { precision: 15, scale: 4 }).notNull(),
  plannedUom: varchar('planned_uom', { length: 20 }).notNull(),
  
  // Actual
  actualQuantity: decimal('actual_quantity', { precision: 15, scale: 4 }),
  actualUom: varchar('actual_uom', { length: 20 }),
  
  // Costing
  unitCost: decimal('unit_cost', { precision: 15, scale: 4 }),
  totalCost: decimal('total_cost', { precision: 15, scale: 4 }),
  
  addedAt: timestamp('added_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  batchIdx: index('batch_idx').on(table.batchId),
  itemIdx: index('item_idx').on(table.itemId),
}));

// ============================================================================
// BATCH OUTPUTS (What Batches Produce)
// ============================================================================

export const batchOutputs = mysqlTable('batch_outputs', {
  id: int('id').primaryKey().autoincrement(),
  batchId: int('batch_id').notNull(),
  itemId: int('item_id').notNull(), // Finished good item
  lotId: int('lot_id'), // Generated lot for output
  locationId: int('location_id').notNull(), // Where output is stored
  
  quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull(),
  uom: varchar('uom', { length: 20 }).notNull(),
  
  outputDate: timestamp('output_date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  batchIdx: index('batch_idx').on(table.batchId),
  itemIdx: index('item_idx').on(table.itemId),
  locationIdx: index('location_idx').on(table.locationId),
}));

// ============================================================================
// BATCH TRANSFERS (Tank/Vessel Movements)
// ============================================================================

export const batchTransfers = mysqlTable('batch_transfers', {
  id: int('id').primaryKey().autoincrement(),
  batchId: int('batch_id').notNull(),
  fromLocationId: int('from_location_id').notNull(),
  toLocationId: int('to_location_id').notNull(),
  
  transferType: varchar('transfer_type', { length: 50 }).notNull(), // fermentor_to_bright, bright_to_keg, bright_to_barrel, etc.
  
  quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull(),
  uom: varchar('uom', { length: 20 }).notNull(),
  
  // Readings at transfer
  gravity: decimal('gravity', { precision: 6, scale: 4 }),
  temperature: decimal('temperature', { precision: 5, scale: 2 }),
  temperatureUnit: varchar('temperature_unit', { length: 1 }).default('F'), // F or C
  
  transferDate: timestamp('transfer_date').notNull(),
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  batchIdx: index('batch_idx').on(table.batchId),
  fromIdx: index('from_idx').on(table.fromLocationId),
  toIdx: index('to_idx').on(table.toLocationId),
  dateIdx: index('date_idx').on(table.transferDate),
}));

// ============================================================================
// FERMENTATION LOGS (Temperature, Gravity Tracking)
// ============================================================================

export const fermentationLogs = mysqlTable('fermentation_logs', {
  id: int('id').primaryKey().autoincrement(),
  batchId: int('batch_id').notNull(),
  logDate: timestamp('log_date').notNull(),
  
  gravity: decimal('gravity', { precision: 6, scale: 4 }),
  temperature: decimal('temperature', { precision: 5, scale: 2 }),
  temperatureUnit: varchar('temperature_unit', { length: 1 }).default('F'),
  
  ph: decimal('ph', { precision: 4, scale: 2 }),
  pressure: decimal('pressure', { precision: 6, scale: 2 }),
  pressureUnit: varchar('pressure_unit', { length: 10 }).default('PSI'),
  
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  batchIdx: index('batch_idx').on(table.batchId),
  dateIdx: index('date_idx').on(table.logDate),
}));
