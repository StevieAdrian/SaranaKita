import { apiClient } from '@/services/api';

export type NotificationType =
  | 'report_created'
  | 'report_status_changed'
  | 'report_commented'
  | 'report_recommended';

export type AppNotification = {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly data: { readonly reportId?: string };
  readonly readAt: string | null;
  readonly createdAt: string;
};

export function listNotifications(): Promise<AppNotification[]> {
  return apiClient.get<AppNotification[]>('/notifications');
}

export function getUnreadNotificationCount(): Promise<{ count: number }> {
  return apiClient.get<{ count: number }>('/notifications/unread-count');
}

export function markNotificationRead(id: string): Promise<AppNotification> {
  return apiClient.patch<AppNotification>(
    `/notifications/${encodeURIComponent(id)}/read`,
  );
}

export function markAllNotificationsRead(): Promise<{ updated: number }> {
  return apiClient.post<{ updated: number }>('/notifications/read-all');
}

export function registerFcmDeviceToken(token: string): Promise<void> {
  return apiClient.post<void>('/notifications/devices/fcm-token', { token });
}

export function removeFcmDeviceToken(token: string): Promise<void> {
  return apiClient.post<void>('/notifications/devices/fcm-token/remove', {
    token,
  });
}
