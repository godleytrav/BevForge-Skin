import { AppShell } from '@/components/AppShell';

export default function SettingsPage() {
  return (
    <AppShell pageTitle="Settings">
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">
            Configure your BevForge system preferences and options.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">General Settings</h3>
            <p className="text-sm text-muted-foreground">Basic configuration options</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-semibold text-foreground">User Preferences</h3>
            <p className="text-sm text-muted-foreground">Personalize your experience</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
