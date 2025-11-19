import { AppShell } from '@/components/AppShell';

export default function OSPage() {
  return (
    <AppShell pageTitle="OS Dashboard" currentSuite="OS">
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">OS – System Core</h2>
          <p className="text-muted-foreground">
            Welcome to the Operating System suite. This is your central hub for system management
            and core functionality.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="group rounded-lg border border-primary bg-card p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <h3 className="mb-2 font-semibold text-foreground">System Status</h3>
            <p className="text-sm text-muted-foreground">All systems operational</p>
          </div>
          <div className="group rounded-lg border border-primary bg-card p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <h3 className="mb-2 font-semibold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Access common tasks</p>
          </div>
          <div className="group rounded-lg border border-primary bg-card p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <h3 className="mb-2 font-semibold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">View latest updates</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
