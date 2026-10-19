import { ReportStatus } from '@/services/report';

export type RecentActivity = {
  id: string;
  title: string;
  status: ReportStatus;
  date: string;
};
