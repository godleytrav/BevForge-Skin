import { AppShell } from '@/components/AppShell';

export default function LabPage() {
  return (
    <AppShell pageTitle="Lab – Recipes" currentSuite="Lab">
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card/30 backdrop-blur-xl p-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Lab – Recipes & R&D</h2>
          <p className="text-muted-foreground">
            Create, manage, and experiment with brewing recipes and formulations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card/30 backdrop-blur-xl p-4">
            <h3 className="mb-2 font-semibold text-foreground">Recipe Library</h3>
            <p className="text-sm text-muted-foreground">Browse all recipes</p>
          </div>
          <div className="rounded-lg border border-border bg-card/30 backdrop-blur-xl p-4">
            <h3 className="mb-2 font-semibold text-foreground">Experiments</h3>
            <p className="text-sm text-muted-foreground">Track R&D projects</p>
          </div>
          <div className="rounded-lg border border-border bg-card/30 backdrop-blur-xl p-4">
            <h3 className="mb-2 font-semibold text-foreground">Ingredients</h3>
            <p className="text-sm text-muted-foreground">Manage inventory</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
