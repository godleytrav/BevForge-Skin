import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Package, 
  ShoppingCart, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';

type Notification = {
  id: number;
  type: 'batch' | 'order' | 'compliance' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'batch',
      title: 'Batch #42 Ready for Bottling',
      message: 'IPA batch has completed fermentation and is ready for the next stage.',
      time: '5 minutes ago',
      read: false,
      priority: 'high',
    },
    {
      id: 2,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #1234 from ABC Distributors - 50 cases of Pale Ale.',
      time: '1 hour ago',
      read: false,
      priority: 'medium',
    },
    {
      id: 3,
      type: 'compliance',
      title: 'TTB Report Due Soon',
      message: 'Monthly production report due in 3 days.',
      time: '2 hours ago',
      read: false,
      priority: 'high',
    },
    {
      id: 4,
      type: 'system',
      title: 'Inventory Low',
      message: 'Hops inventory below minimum threshold (5 lbs remaining).',
      time: '3 hours ago',
      read: true,
      priority: 'medium',
    },
    {
      id: 5,
      type: 'order',
      title: 'Order #1230 Delivered',
      message: 'Successfully delivered to XYZ Bar & Grill.',
      time: '1 day ago',
      read: true,
      priority: 'low',
    },
    {
      id: 6,
      type: 'batch',
      title: 'Batch #40 Completed',
      message: 'Stout batch has been packaged and added to inventory.',
      time: '2 days ago',
      read: true,
      priority: 'low',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'batch': return Package;
      case 'order': return ShoppingCart;
      case 'compliance': return FileText;
      case 'system': return AlertCircle;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const Icon = getIcon(notification.type);
    
    return (
      <div className={`p-4 rounded-lg border ${!notification.read ? 'bg-accent/50' : ''}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            notification.priority === 'high' ? 'bg-destructive/10' :
            notification.priority === 'medium' ? 'bg-yellow-500/10' :
            'bg-primary/10'
          }`}>
            <Icon className={`h-4 w-4 ${getPriorityColor(notification.priority)}`} />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              {!notification.read && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{notification.time}</span>
              <Badge variant="outline" className="ml-2">{notification.type}</Badge>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                  className="h-7 text-xs"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Mark as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNotification(notification.id)}
                className="h-7 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppShell pageTitle="Notifications">
      <div className="max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="batch">Batches</TabsTrigger>
            <TabsTrigger value="order">Orders</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No notifications</p>
                  <p className="text-sm text-muted-foreground">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3">
            {notifications.filter(n => !n.read).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <p className="text-lg font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground">No unread notifications</p>
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter(n => !n.read)
                .map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
            )}
          </TabsContent>

          <TabsContent value="batch" className="space-y-3">
            {notifications
              .filter(n => n.type === 'batch')
              .map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
          </TabsContent>

          <TabsContent value="order" className="space-y-3">
            {notifications
              .filter(n => n.type === 'order')
              .map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
          </TabsContent>

          <TabsContent value="compliance" className="space-y-3">
            {notifications
              .filter(n => n.type === 'compliance')
              .map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
