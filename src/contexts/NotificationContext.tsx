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
    title: 'Batch #2024-001 Ready',
    description: 'IPA batch has completed fermentation and is ready for packaging',
    time: '2 minutes ago',
    type: 'production',
    read: false,
    icon: 'beaker',
  },
  {
    id: '2',
    title: 'New Order Received',
    description: 'Order #5432 from Riverside Tavern - 10 cases of Pale Ale',
    time: '15 minutes ago',
    type: 'sales',
    read: false,
    icon: 'shopping-cart',
  },
  {
    id: '3',
    title: 'Compliance Report Due',
    description: 'Monthly production report due in 3 days',
    time: '1 hour ago',
    type: 'compliance',
    read: false,
    icon: 'alert-circle',
  },
  {
    id: '4',
    title: 'Low Inventory Alert',
    description: 'Cascade hops inventory below minimum threshold',
    time: '2 hours ago',
    type: 'inventory',
    read: true,
    icon: 'package',
  },
  {
    id: '5',
    title: 'Equipment Maintenance',
    description: 'Fermenter #3 scheduled for cleaning tomorrow',
    time: '3 hours ago',
    type: 'production',
    read: true,
    icon: 'wrench',
  },
  {
    id: '6',
    title: 'Payment Received',
    description: 'Payment processed for Order #5401 - $2,450.00',
    time: '5 hours ago',
    type: 'sales',
    read: true,
    icon: 'dollar-sign',
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
