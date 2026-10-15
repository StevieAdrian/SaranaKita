import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ManageUser } from '@/services/users';

export type AuthStackParamList = {
  Login: undefined;
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
  ProfileSettings: undefined;
  UserManagement: undefined;
  AddUser: undefined;
  EditUser: { user: ManageUser };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
