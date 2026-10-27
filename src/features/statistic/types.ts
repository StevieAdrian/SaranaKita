import type { ReportStatus } from '@/services/report';

export type RecentActivityType =
  | 'created'
  | 'voted'
  | 'recommended'
  | 'status_changed';

export type RecentActivity = {
  id: string;
  reportId: string;
  title: string;
  status: ReportStatus;
  date: string;
  activityType: RecentActivityType;
  description: string;
};

export type MonitoringStatistics = {
  total: number;
  completed: number;
  waitingVerification: number;
  inInspection: number;
  inRepair: number;
};

export type MonitoringResponse = {
  statistics: MonitoringStatistics;
  activities: RecentActivity[];
};
