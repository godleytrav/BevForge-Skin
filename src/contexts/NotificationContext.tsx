import { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'production' | 'sales' | 'compliance' | 'inventory' | 'system';
  read: boolean;
  icon: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  filterNotifications: (filter: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Order #1245 Requires Approval',
    description: 'Downtown Taproom order for $2,340 needs manager approval',
    time: '5 minutes ago',
    type: 'sales',
    read: false,
    icon: 'alert-circle',
  },
  {
    id: '2',
    title: 'Batch #234 Quality Review',
    description: 'IPA batch quality report flagged for review - gravity reading outside range',
    time: '15 minutes ago',
    type: 'production',
    read: false,
    icon: 'beaker',
  },
  {
    id: '3',
    title: 'Delivery Scheduled',
    description: 'Order #1243 delivery confirmed for tomorrow 10:00 AM',
    time: '30 minutes ago',
    type: 'sales',
    read: false,
    icon: 'shopping-cart',
  },
  {
    id: '4',
    title: 'TTB Monthly Report Due',
    description: 'Federal excise tax report due in 2 days - submit by Dec 21',
    time: '1 hour ago',
    type: 'compliance',
    read: false,
    icon: 'alert-circle',
  },
  {
    id: '5',
    title: 'Low Inventory Alert',
    description: 'Cascade hops below minimum threshold (5 lbs remaining)',
    time: '2 hours ago',
    type: 'inventory',
    read: false,
    icon: 'package',
  },
  {
    id: '6',
    title: 'Vendor Payment Approved',
    description: 'Payment to Hop Suppliers Inc. ($1,250) has been approved',
    time: '3 hours ago',
    type: 'sales',
    read: true,
    icon: 'dollar-sign',
  },
  {
    id: '7',
    title: 'Inventory Discrepancy Detected',
    description: 'Mismatch in Batch #232 - expected 500 units, found 485 units',
    time: '4 hours ago',
    type: 'inventory',
    read: true,
    icon: 'alert-circle',
  },
  {
    id: '8',
    title: 'New Order Received',
    description: 'Order #1246 from Westside Pub - 15 cases Pale Ale, 10 cases IPA',
    time: '5 hours ago',
    type: 'sales',
    read: true,
    icon: 'shopping-cart',
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const filterNotifications = (filter: string) => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        filterNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
