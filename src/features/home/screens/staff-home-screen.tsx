import React from 'react';
import { USER_ROLE } from '@/services/auth';
import { getThemeColors } from '@/shared/theme';
import { useCurrentUser } from '../hooks/use-current-user';
import { AdministratorHomeScreen } from './administrator-home-screen';

export function StaffHomeScreen(): React.JSX.Element {
  const user = useCurrentUser();

  return (
    <AdministratorHomeScreen
      name={`Staff ${user?.displayName ?? ''}`.trim()}
      primaryColor={getThemeColors(USER_ROLE.STAFF).primary}
    />
  );
}
