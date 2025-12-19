
# OPS-UI-CONTRACT.md
## BevForge OPS — UI Capability Contract

### 0. Authority & Intent
This document defines WHAT operator capabilities MUST exist in the OPS UI.
It intentionally does NOT define layout, placement, or visual design.
Any UI implementation is valid if all capabilities below are satisfied.

---

## A. Global Operator Capabilities

A.1 The operator MUST be able to access all OPS domains.
A.2 The operator MUST be able to initiate core ops actions quickly.
A.3 The operator MUST be alerted to items requiring attention.

---

## B. Operational Awareness

B.1 The operator MUST be able to see:
- Orders requiring action
- Deliveries scheduled or overdue
- Compliance deadlines
- Inventory at risk

B.2 Each awareness item MUST be directly navigable to detail.

---

## C. Directory (CRM) Capabilities

C.1 The operator MUST be able to access a directory of customers.
C.2 The operator MUST be able to access vendors and facilities.
C.3 The operator MUST be able to initiate orders and deliveries from directory context.
C.4 The operator MUST be able to view historical interactions.

---

## D. Orders Capabilities

D.1 The operator MUST be able to create and edit orders.
D.2 The operator MUST be able to associate orders with customers.
D.3 The operator MUST be able to track order status.
D.4 The operator MUST be able to navigate from order to related deliveries.

---

## E. Deliveries Capabilities

E.1 The operator MUST be able to create deliveries.
E.2 The operator MUST be able to associate inventory with deliveries.
E.3 The operator MUST be able to define origin and destination.
E.4 The operator MUST be able to track delivery state.
E.5 The operator MUST be able to view delivery history and exceptions.

---

## F. Inventory Capabilities

F.1 The operator MUST be able to view current inventory state.
F.2 The operator MUST be able to view inventory movement history.
F.3 The operator MUST be able to identify inventory by location and status.

---

## G. Compliance Capabilities

G.1 The operator MUST be able to view removals.
G.2 The operator MUST be able to view tax-relevant events.
G.3 The operator MUST be able to view reporting period status.

---

## H. Tasks & Approvals Capabilities

H.1 The operator MUST be able to view assigned tasks.
H.2 The operator MUST be able to complete tasks.
H.3 The operator MUST be able to approve or reject actions when required.

---

## I. Visibility Guarantees

I.1 Critical operational issues MUST be visible without deep navigation.
I.2 Compliance risks MUST be surfaced.
I.3 Inventory discrepancies MUST be discoverable.

---

## J. UX Freedom Clause

Implementations may choose any UX approach provided all above capabilities are present and discoverable.
