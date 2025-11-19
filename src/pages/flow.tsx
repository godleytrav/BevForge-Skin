import { AppShell } from '@/components/AppShell';

export default function FlowPage() {
  return (
    <AppShell pageTitle="Flow – Taproom Console" currentSuite="Flow">
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Flow – Keg & Tap Management</h2>
          <p className="text-muted-foreground">
            Manage your kegs, taps, and beverage flow operations from this central console.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Active Taps</h3>
            <p className="text-sm text-muted-foreground">Monitor tap status</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Keg Inventory</h3>
            <p className="text-sm text-muted-foreground">Track keg levels</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Pour Analytics</h3>
            <p className="text-sm text-muted-foreground">View pour data</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
