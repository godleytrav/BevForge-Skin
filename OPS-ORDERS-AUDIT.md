# OPS Orders Page Audit Report

**Date:** December 24, 2025  
**Status:** CRITICAL ISSUES FOUND

---

## 🚨 CRITICAL ISSUES

### 1. **Status Value Mismatch (BLOCKING)**

**Problem:** Frontend and API use completely different status values.

**API Returns:**
```typescript
type OrderStatus = 'draft' | 'confirmed' | 'approved' | 'in-packing' | 'packed' | 'loaded' | 'in-delivery' | 'delivered' | 'cancelled';
```

**Frontend Stats Calculation Uses:**
```typescript
stats.pending = orders.filter(o => o.status === 'pending').length;
stats.processing = orders.filter(o => o.status === 'processing').length;
stats.fulfilled = orders.filter(o => o.status === 'fulfilled').length;
```

**Impact:** Stats always show 0 because status values never match.

**Solution:** Update stats calculation to use correct status values:
- `pending` → `draft` or `confirmed`
- `processing` → `approved` or `in-packing` or `packed` or `loaded` or `in-delivery`
- `fulfilled` → `delivered`

---

### 2. **Data Structure Mismatch**

**Problem:** Frontend expects different field names than API provides.

**API Returns:**
```json
{
  "id": "ORD-001",
  "customer_name": "Joe's Bar",
  "order_date": "2025-12-20T10:00:00Z",
  "total_amount": 450,
  "lineItems": [...]
}
```

**Frontend Interface Expects:**
```typescript
interface Order {
  id: number;           // API returns string
  customer_name: string; // ✅ Matches
  order_date: string;    // ✅ Matches
  total: number;         // API returns total_amount
  line_items: LineItem[]; // API returns lineItems
}
```

**Impact:** 
- `order.total` is undefined (should be `total_amount`)
- `order.line_items` is undefined (should be `lineItems`)
- Total revenue calculation fails

---

### 3. **Null Safety Issues**

**Problem:** Code assumes all fields exist without null checks.

**Examples:**
```typescript
// Line 231 - Fixed but may still have issues
(order.customer_name || '').toLowerCase()

// Line 262 - Will fail if total is undefined
totalRevenue: orders.reduce((sum, o) => sum + o.total, 0)
```

---

## 📊 API ANALYSIS

### Orders API Response Structure

```json
{
  "id": "ORD-001",
  "orderNumber": "ORD-001",
  "customerId": "CUST-001",
  "customer_name": "Joe's Bar",
  "status": "approved",
  "order_date": "2025-12-20T10:00:00Z",
  "delivery_date": "2025-12-24T14:00:00Z",
  "total_amount": 450,
  "deposit_amount": 150,
  "lineItems": [
    {
      "id": "LINE-001",
      "productId": "PROD-IPA",
      "productName": "IPA",
      "containerTypeId": "KEG-HALF",
      "containerType": "Keg (1/2 BBL)",
      "quantity": 3,
      "unitPrice": 150,
      "depositPerUnit": 50,
      "totalPrice": 450,
      "totalDeposit": 150
    }
  ],
  "notes": "Regular weekly delivery",
  "createdAt": "2025-12-20T10:00:00Z",
  "updatedAt": "2025-12-20T10:00:00Z"
}
```

### Status Values in Use
- `draft` - New orders pending approval
- `approved` - Orders approved for fulfillment
- `delivered` - Completed orders
- `cancelled` - Cancelled orders

---

## 🔧 REQUIRED FIXES

### Fix 1: Update TypeScript Interface

```typescript
interface Order {
  id: string;                    // Changed from number
  orderNumber: string;           // Added
  customerId: string;            // Added
  customer_name: string;
  order_date: string;
  delivery_date?: string;        // Added
  status: OrderStatus;
  total_amount: number;          // Changed from total
  deposit_amount?: number;       // Added
  lineItems: LineItem[];         // Changed from line_items
  notes?: string;                // Added
  createdAt: string;             // Changed from created_at
  updatedAt?: string;            // Added
}
```

### Fix 2: Update LineItem Interface

```typescript
interface LineItem {
  id?: string;                   // Changed from number
  productId: string;             // Added
  productName: string;           // Added
  containerTypeId: string;       // Added
  containerType: string;         // Added
  quantity: number;              // Changed from qty
  unitPrice: number;             // Changed from price
  depositPerUnit?: number;       // Added
  totalPrice: number;            // Added
  totalDeposit?: number;         // Added
}
```

### Fix 3: Update Stats Calculation

```typescript
const stats = useMemo(() => {
  return {
    total: orders.length,
    pending: orders.filter(o => ['draft', 'confirmed'].includes(o.status)).length,
    processing: orders.filter(o => ['approved', 'in-packing', 'packed', 'loaded', 'in-delivery'].includes(o.status)).length,
    fulfilled: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
  };
}, [orders]);
```

### Fix 4: Update All References

Replace all instances of:
- `order.total` → `order.total_amount`
- `order.line_items` → `order.lineItems`
- `order.created_at` → `order.createdAt`

---

## 🎯 PRIORITY

**CRITICAL** - Page is completely non-functional due to these issues.

**Estimated Fix Time:** 15-20 minutes

**Testing Required:**
1. Verify page loads without errors
2. Verify stats display correct values
3. Verify order list displays correctly
4. Verify search and filters work
5. Verify order details modal works
6. Verify create/edit order works

---

## 📝 NOTES

- The API is working correctly and returning valid data
- The frontend code was written for a different API structure
- All issues are in the frontend TypeScript interfaces and calculations
- No backend changes required
