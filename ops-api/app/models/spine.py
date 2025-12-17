from datetime import datetime
from enum import Enum
from uuid import UUID

from sqlalchemy import Enum as PgEnum
from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import UUIDBase


class LocationType(str, Enum):
    WAREHOUSE = "warehouse"
    TASTING_ROOM = "tasting_room"
    DISTRIBUTION_CENTER = "distribution_center"
    CUSTOMER = "customer"


class VesselType(str, Enum):
    TANK = "tank"
    BARREL = "barrel"
    KEG = "keg"
    BOTTLING_LINE = "bottling_line"


class BatchStatus(str, Enum):
    PLANNED = "planned"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PackageType(str, Enum):
    BOTTLE = "bottle"
    CAN = "can"
    KEG = "keg"
    BAG_IN_BOX = "bag_in_box"


class InventoryReason(str, Enum):
    PRODUCTION = "production"
    ADJUSTMENT = "adjustment"
    SHIPMENT = "shipment"
    RECEIPT = "receipt"


class EventType(str, Enum):
    PRODUCTION = "production"
    MOVEMENT = "movement"
    QUALITY = "quality"
    NOTE = "note"


class Party(UUIDBase):
    __tablename__ = "party"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(512))

    locations: Mapped[list["Location"]] = relationship(back_populates="party")
    deliveries: Mapped[list["Delivery"]] = relationship(back_populates="party")


class Location(UUIDBase):
    __tablename__ = "location"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location_type: Mapped[LocationType] = mapped_column(PgEnum(LocationType, name="location_type"), nullable=False)
    party_id: Mapped[UUID | None] = mapped_column(ForeignKey("party.id"))

    party: Mapped[Party | None] = relationship(back_populates="locations")
    deliveries: Mapped[list["Delivery"]] = relationship(back_populates="location")


class Product(UUIDBase):
    __tablename__ = "product"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sku: Mapped[str | None] = mapped_column(String(100))

    batches: Mapped[list["Batch"]] = relationship(back_populates="product")
    ledger_entries: Mapped[list["InventoryLedger"]] = relationship(back_populates="product")


class Batch(UUIDBase):
    __tablename__ = "batch"

    product_id: Mapped[UUID] = mapped_column(ForeignKey("product.id"), nullable=False)
    status: Mapped[BatchStatus] = mapped_column(PgEnum(BatchStatus, name="batch_status"), nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    product: Mapped[Product] = relationship(back_populates="batches")
    vessels: Mapped[list["Vessel"]] = relationship(back_populates="batch")
    packaging_runs: Mapped[list["PackagingRun"]] = relationship(back_populates="batch")
    events: Mapped[list["OpsEvent"]] = relationship(back_populates="batch")


class Vessel(UUIDBase):
    __tablename__ = "vessel"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    vessel_type: Mapped[VesselType] = mapped_column(PgEnum(VesselType, name="vessel_type"), nullable=False)
    batch_id: Mapped[UUID | None] = mapped_column(ForeignKey("batch.id"))
    capacity_liters: Mapped[Numeric | None] = mapped_column(Numeric(12, 2))

    batch: Mapped[Batch | None] = relationship(back_populates="vessels")


class PackagingRun(UUIDBase):
    __tablename__ = "packaging_run"

    batch_id: Mapped[UUID] = mapped_column(ForeignKey("batch.id"), nullable=False)
    package_type: Mapped[PackageType] = mapped_column(PgEnum(PackageType, name="package_type"), nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    batch: Mapped[Batch] = relationship(back_populates="packaging_runs")
    package_lots: Mapped[list["PackageLot"]] = relationship(back_populates="packaging_run")


class PackageLot(UUIDBase):
    __tablename__ = "package_lot"

    packaging_run_id: Mapped[UUID] = mapped_column(ForeignKey("packaging_run.id"), nullable=False)
    lot_code: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    packaging_run: Mapped[PackagingRun] = relationship(back_populates="package_lots")


class OpsEvent(UUIDBase):
    __tablename__ = "ops_event"

    event_type: Mapped[EventType] = mapped_column(PgEnum(EventType, name="event_type"), nullable=False)
    batch_id: Mapped[UUID | None] = mapped_column(ForeignKey("batch.id"))
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    batch: Mapped[Batch | None] = relationship(back_populates="events")


class InventoryLedger(UUIDBase):
    __tablename__ = "inventory_ledger"

    product_id: Mapped[UUID] = mapped_column(ForeignKey("product.id"), nullable=False)
    reason: Mapped[InventoryReason] = mapped_column(PgEnum(InventoryReason, name="inventory_reason"), nullable=False)
    delta_units: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[str | None] = mapped_column(String(512))

    product: Mapped[Product] = relationship(back_populates="ledger_entries")


class Delivery(UUIDBase):
    __tablename__ = "delivery"

    party_id: Mapped[UUID | None] = mapped_column(ForeignKey("party.id"))
    location_id: Mapped[UUID | None] = mapped_column(ForeignKey("location.id"))
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    party: Mapped[Party | None] = relationship(back_populates="deliveries")
    location: Mapped[Location | None] = relationship(back_populates="deliveries")
