import { AppShell } from '@/components/AppShell';

export default function OpsPage() {
  return (
    <AppShell pageTitle="Ops – Business Overview" currentSuite="Ops">
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Ops – Business Operations</h2>
          <p className="text-muted-foreground">
            Manage inventory, finances, compliance, and all business operations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Inventory</h3>
            <p className="text-sm text-muted-foreground">Track stock levels</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Financials</h3>
            <p className="text-sm text-muted-foreground">View reports</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Compliance</h3>
            <p className="text-sm text-muted-foreground">Regulatory tracking</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
