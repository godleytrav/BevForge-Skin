import { AppShell } from '@/components/AppShell';

export default function ConnectPage() {
  return (
    <AppShell pageTitle="Connect – Employee Hub" currentSuite="Connect">
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Connect – Employee Hub</h2>
          <p className="text-muted-foreground">
            Timeclock, task management, and internal communication for your team.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Timeclock</h3>
            <p className="text-sm text-muted-foreground">Clock in/out</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Tasks</h3>
            <p className="text-sm text-muted-foreground">Manage assignments</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">Team Feed</h3>
            <p className="text-sm text-muted-foreground">Internal updates</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
