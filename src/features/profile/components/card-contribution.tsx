import React from 'react';
import { useRole } from '@/shared/context/theme-context';
import {
  CardAdministratorStatistics,
  type CardAdministratorStatisticsProps,
} from './card-administrator-statistics';
import {
  CardStaffContribution,
  type CardStaffContributionProps,
} from './card-staff-contribution';
import {
  CardStudentTeacherContribution,
  type CardStudentTeacherContributionProps,
} from './card-siswa-guru-contribution';

export type CardContributionProps = CardStudentTeacherContributionProps &
  CardStaffContributionProps &
  CardAdministratorStatisticsProps;

export function CardContribution(props: CardContributionProps): React.JSX.Element {
  const { currentRole } = useRole();
  const effectiveRole = props.role ?? currentRole;

  if (effectiveRole === 'administrator') {
    return <CardAdministratorStatistics {...props} />;
  }

  if (effectiveRole === 'staff') {
    return <CardStaffContribution {...props} />;
  }

  return <CardStudentTeacherContribution {...props} role={effectiveRole} />;
}

export {
  CardAdministratorStatistics,
  CardStaffContribution,
  CardStudentTeacherContribution,
  type CardAdministratorStatisticsProps,
  type CardStaffContributionProps,
  type CardStudentTeacherContributionProps,
};
