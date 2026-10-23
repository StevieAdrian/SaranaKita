import type { NavigatorScreenParams } from '@react-navigation/native';
import type { RegisterProfileRouteParams } from '@/features/auth';
import type { ManageUser } from '@/services/users';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  RegisterProfile?: RegisterProfileRouteParams;
  Loading?: { message?: string };
  NotFound?: undefined;
};

export type TabParamList = {
  Home: undefined;
  Statistic: undefined;
  CreateReportTab: undefined;
  ReportHistory: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
  CreateReport: undefined;
  ReportDetail: { reportId: string };
  ManagementReportDetail: { reportId: string };
  EditReport: { reportId: string };
  ProfileSettings: undefined;
  UserManagement: { toastMessage?: string; toastType?: 'success' | 'error' } | undefined;
  AddUser: undefined;
  EditUser: { user: ManageUser };
  NotFound: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
