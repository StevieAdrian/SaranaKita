import type { NavigatorScreenParams } from '@react-navigation/native';
import type { RegisterProfileRouteParams, RegisterRouteParams } from '@/features/auth/types';
import type { ManageUser } from '@/services/users';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register?: RegisterRouteParams;
  SignUp?: RegisterRouteParams;
  RegisterProfile?: RegisterProfileRouteParams;
  OtpVerification: {
    email: string;
    mode?: 'signup' | 'reset-password';
    from?: 'register' | 'login' | 'forgot-password';
  };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  Loading?: { message?: string };
  NotFound?: { title?: string; message?: string };
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
  NotFound?: { title?: string; message?: string };
  EvaluationReport: {
    reportId: string;
    reportTitle: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
