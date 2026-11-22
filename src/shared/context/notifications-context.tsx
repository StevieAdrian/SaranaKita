import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { Env } from '@/config/env';
import { authClient } from '@/services/auth';
import {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from '@/services/notifications';

type NotificationsContextValue = {
  readonly notifications: readonly AppNotification[];
  readonly unreadCount: number;
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
  readonly markRead: (id: string) => Promise<AppNotification>;
  readonly markAllRead: () => Promise<void>;
};

const emptyValue: NotificationsContextValue = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  refresh: async () => undefined,
  markRead: async () => {
    throw new Error('Notifications provider is unavailable.');
  },
  markAllRead: async () => undefined,
};

const NotificationsContext =
  createContext<NotificationsContextValue>(emptyValue);

function notificationSocketUrl(): string {
  return Env.apiBaseUrl.replace(/\/api$/, '');
}

export function NotificationsProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const user = useSyncExternalStore(
    authClient.subscribe,
    authClient.getState,
  ).user;
  const [notifications, setNotifications] = useState<
    readonly AppNotification[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (): Promise<void> => {
    if (!authClient.getState().user) return;
    setLoading(true);
    try {
      const [items, unread] = await Promise.all([
        listNotifications(),
        getUnreadNotificationCount(),
      ]);
      setNotifications(items);
      setUnreadCount(unread.count);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let active = true;
    void refresh().catch(() => {
      if (active) setLoading(false);
    });

    const token = authClient.getAccessToken();
    if (!token)
      return () => {
        active = false;
      };

    const socket: Socket = io(`${notificationSocketUrl()}/notifications`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
    });

    socket.on('connect', () => {
      void refresh().catch(() => undefined);
    });
    socket.on('notification:new', (notification: AppNotification) => {
      if (!active) return;
      setNotifications(current => {
        if (current.some(item => item.id === notification.id)) return current;
        return [notification, ...current].slice(0, 100);
      });
      if (!notification.readAt) {
        setUnreadCount(current => current + 1);
      }
    });

    return () => {
      active = false;
      socket.disconnect();
    };
  }, [refresh, user]);

  const markRead = useCallback(
    async (id: string): Promise<AppNotification> => {
      const updated = await markNotificationRead(id);
      setNotifications(current =>
        current.map(item => (item.id === id ? updated : item)),
      );
      setUnreadCount(current => {
        const wasUnread = notifications.some(
          item => item.id === id && item.readAt === null,
        );
        return wasUnread ? Math.max(0, current - 1) : current;
      });
      return updated;
    },
    [notifications],
  );

  const markAllRead = useCallback(async (): Promise<void> => {
    await markAllNotificationsRead();
    setNotifications(current =>
      current.map(item =>
        item.readAt ? item : { ...item, readAt: new Date().toISOString() },
      ),
    );
    setUnreadCount(0);
  }, []);

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      loading,
      refresh,
      markRead,
      markAllRead,
    }),
    [loading, markAllRead, markRead, notifications, refresh, unreadCount],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  return useContext(NotificationsContext);
}
