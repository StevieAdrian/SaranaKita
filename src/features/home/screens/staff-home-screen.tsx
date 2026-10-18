import React from 'react';
import { useCurrentUser } from '../hooks/use-current-user';
import { AdministratorHomeScreen } from './administrator-home-screen';

const STAFF_PRIMARY = '#173574';

export function StaffHomeScreen(): React.JSX.Element {
  const user = useCurrentUser();

  return (
    <AdministratorHomeScreen
      name={`Staff ${user?.displayName ?? ''}`.trim()}
      primaryColor={STAFF_PRIMARY}
    />
  );
}
