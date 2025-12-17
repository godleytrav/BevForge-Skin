"""initial ops spine schema

Revision ID: 0001_initial_ops_spine
Revises: 
Create Date: 2024-08-25 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0001_initial_ops_spine"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    location_type = postgresql.ENUM(
        "warehouse",
        "tasting_room",
        "distribution_center",
        "customer",
        name="location_type",
    )
    vessel_type = postgresql.ENUM(
        "tank",
        "barrel",
        "keg",
        "bottling_line",
        name="vessel_type",
    )
    batch_status = postgresql.ENUM(
        "planned",
        "active",
        "completed",
        "cancelled",
        name="batch_status",
    )
    package_type = postgresql.ENUM(
        "bottle",
        "can",
        "keg",
        "bag_in_box",
        name="package_type",
    )
    inventory_reason = postgresql.ENUM(
        "production",
        "adjustment",
        "shipment",
        "receipt",
        name="inventory_reason",
    )
    event_type = postgresql.ENUM(
        "production",
        "movement",
        "quality",
        "note",
        name="event_type",
    )

    location_type.create(op.get_bind(), checkfirst=True)
    vessel_type.create(op.get_bind(), checkfirst=True)
    batch_status.create(op.get_bind(), checkfirst=True)
    package_type.create(op.get_bind(), checkfirst=True)
    inventory_reason.create(op.get_bind(), checkfirst=True)
    event_type.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "party",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.String(length=512), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "product",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("sku", sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "location",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("location_type", location_type, nullable=False),
        sa.Column("party_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(["party_id"], ["party.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "batch",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", batch_status, nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["product_id"], ["product.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "inventory_ledger",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("reason", inventory_reason, nullable=False),
        sa.Column("delta_units", sa.Integer(), nullable=False),
        sa.Column("notes", sa.String(length=512), nullable=True),
        sa.ForeignKeyConstraint(["product_id"], ["product.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "ops_event",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("event_type", event_type, nullable=False),
        sa.Column("batch_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["batch.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "vessel",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("vessel_type", vessel_type, nullable=False),
        sa.Column("batch_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("capacity_liters", sa.Numeric(precision=12, scale=2), nullable=True),
        sa.ForeignKeyConstraint(["batch_id"], ["batch.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "packaging_run",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("batch_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("package_type", package_type, nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["batch_id"], ["batch.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "package_lot",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("packaging_run_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("lot_code", sa.String(length=100), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["packaging_run_id"], ["packaging_run.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "delivery",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("party_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("location_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("delivered_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["location_id"], ["location.id"], ),
        sa.ForeignKeyConstraint(["party_id"], ["party.id"], ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("delivery")
    op.drop_table("package_lot")
    op.drop_table("packaging_run")
    op.drop_table("vessel")
    op.drop_table("ops_event")
    op.drop_table("inventory_ledger")
    op.drop_table("batch")
    op.drop_table("location")
    op.drop_table("product")
    op.drop_table("party")

    op.execute("DROP TYPE IF EXISTS event_type")
    op.execute("DROP TYPE IF EXISTS inventory_reason")
    op.execute("DROP TYPE IF EXISTS package_type")
    op.execute("DROP TYPE IF EXISTS batch_status")
    op.execute("DROP TYPE IF EXISTS vessel_type")
    op.execute("DROP TYPE IF EXISTS location_type")
