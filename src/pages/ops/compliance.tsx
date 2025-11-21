import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Clock, Upload } from 'lucide-react';

// Mock data
const complianceItems = [
  { id: 1, title: 'TTB Monthly Report', dueDate: '2024-12-01', status: 'completed', category: 'Federal' },
  { id: 2, title: 'State Excise Tax Filing', dueDate: '2024-12-10', status: 'pending', category: 'State' },
  { id: 3, title: 'Label Approval Renewal', dueDate: '2024-12-15', status: 'overdue', category: 'Federal' },
  { id: 4, title: 'Health Inspection Certificate', dueDate: '2025-01-20', status: 'upcoming', category: 'Local' },
  { id: 5, title: 'Alcohol License Renewal', dueDate: '2025-02-01', status: 'upcoming', category: 'State' },
];

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  completed: { 
    label: 'Completed', 
    icon: CheckCircle2, 
    className: 'bg-green-500/20 text-green-400 border-green-500/50' 
  },
  pending: { 
    label: 'Pending', 
    icon: Clock, 
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' 
  },
  overdue: { 
    label: 'Overdue', 
    icon: AlertCircle, 
    className: 'bg-red-500/20 text-red-400 border-red-500/50' 
  },
  upcoming: { 
    label: 'Upcoming', 
    icon: Clock, 
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/50' 
  },
};

export default function CompliancePage() {
  const overdueCount = complianceItems.filter(item => item.status === 'overdue').length;
  const pendingCount = complianceItems.filter(item => item.status === 'pending').length;

  return (
    <AppShell pageTitle="Compliance Center">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compliance Center</h1>
            <p className="text-muted-foreground mt-1">Track regulatory requirements and deadlines</p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card style={{
            background: overdueCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: overdueCount > 0 ? '1px solid hsl(0, 84%, 60%)' : '1px solid hsl(142, 76%, 36%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Status</p>
                  <p className="text-2xl font-bold mt-1">
                    {overdueCount > 0 ? 'Needs Attention' : 'Compliant'}
                  </p>
                </div>
                {overdueCount > 0 ? (
                  <AlertCircle className="h-8 w-8 text-red-400" />
                ) : (
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Items</p>
                <p className="text-3xl font-bold mt-1 text-red-400">{overdueCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Requires immediate action</p>
              </div>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-3xl font-bold mt-1 text-yellow-400">{pendingCount}</p>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Checklist */}
        <Card style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid hsl(200, 15%, 65%)',
          backdropFilter: 'blur(12px)',
        }}>
          <CardHeader>
            <CardTitle>Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceItems.map((item) => {
                const StatusIcon = statusConfig[item.status].icon;
                return (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <StatusIcon className={`h-5 w-5 ${
                        item.status === 'completed' ? 'text-green-400' :
                        item.status === 'overdue' ? 'text-red-400' :
                        item.status === 'pending' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge className={statusConfig[item.status].className}>
                        {statusConfig[item.status].label}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        {item.status === 'completed' ? 'View' : 'Update'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Federal Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">• TTB Portal</li>
                <li className="hover:text-foreground cursor-pointer">• Federal Tax Forms</li>
                <li className="hover:text-foreground cursor-pointer">• Label Approval System</li>
              </ul>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">State Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">• State License Portal</li>
                <li className="hover:text-foreground cursor-pointer">• Excise Tax Filing</li>
                <li className="hover:text-foreground cursor-pointer">• State Regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid hsl(200, 15%, 65%)',
            backdropFilter: 'blur(12px)',
          }}>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Local Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">• Health Department</li>
                <li className="hover:text-foreground cursor-pointer">• Business Licenses</li>
                <li className="hover:text-foreground cursor-pointer">• Zoning Information</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
