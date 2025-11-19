import { AppShell } from '@/components/AppShell';

export default function OSPage() {
  return (
    <AppShell pageTitle="OS Dashboard" currentSuite="OS">
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card/30 backdrop-blur-xl p-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">OS – System Core</h2>
          <p className="text-muted-foreground">
            Welcome to the Operating System suite. This is your central hub for system management
            and core functionality.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div 
            className="group rounded-lg p-4 transition-all duration-300"
            style={{
              background: 'rgba(15, 23, 42, 0.3)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '2px solid hsl(190, 95%, 60%)',
              boxShadow: '0 0 0 rgba(0, 229, 255, 0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 229, 255, 0)';
            }}
          >
            <h3 className="mb-2 font-semibold text-foreground">System Status</h3>
            <p className="text-sm text-muted-foreground">All systems operational</p>
          </div>
          <div 
            className="group rounded-lg bg-card p-4 transition-all duration-300"
            style={{
              border: '2px solid hsl(190, 95%, 60%)',
              boxShadow: '0 0 0 rgba(0, 229, 255, 0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 229, 255, 0)';
            }}
          >
            <h3 className="mb-2 font-semibold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Access common tasks</p>
          </div>
          <div 
            className="group rounded-lg bg-card p-4 transition-all duration-300"
            style={{
              border: '2px solid hsl(190, 95%, 60%)',
              boxShadow: '0 0 0 rgba(0, 229, 255, 0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 rgba(0, 229, 255, 0)';
            }}
          >
            <h3 className="mb-2 font-semibold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">View latest updates</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
