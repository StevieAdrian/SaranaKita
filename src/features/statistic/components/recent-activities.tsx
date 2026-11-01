import React from 'react';
import { Text, View } from 'react-native';
import type { UserRole } from '@/services/auth';
import {
  REPORT_STATUS,
  REPORT_STATUS_NAME_BY_STATUS,
  type ReportStatus,
} from '@/services/report';
import { getThemeColors, palette } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';
import type { RecentActivity } from '../types';

type RecentActivitiesProps = {
  role: UserRole;
  activities: RecentActivity[];
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  [REPORT_STATUS.WAITING_VERIFICATION]: palette.primary,
  [REPORT_STATUS.IN_REVIEW]: palette.warning,
  [REPORT_STATUS.IN_REPAIR]: palette.brown,
  [REPORT_STATUS.REJECTED]: palette.danger,
  [REPORT_STATUS.DONE]: palette.greenStatus,
};

function formatActivityDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function RecentActivities({
  role,
  activities,
}: RecentActivitiesProps): React.JSX.Element {
  const { theme } = useRole();
  const colors = theme;

  return (
    <View
      className="gap-3 px-5 py-5"
      style={{ backgroundColor: colors.background }}
    >
      <Text
        className="text-[16px] text-base font-bold"
        style={{ color: colors.textHeading }}
      >
        Aktivitas Terbaru
      </Text>

      <View
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: colors.surface }}
      >
        {activities.length > 0 ? (
          activities.slice(0, 3).map((activity, index) => (
            <View
              key={activity.id}
              className={`flex-row items-start gap-3 px-4 py-4 ${index !== activities.length - 1 ? 'border-b' : ''
                }`}
              style={
                index !== activities.length - 1
                  ? { borderBottomColor: colors.borderSubtle }
                  : undefined
              }
            >
              <View
                className="mt-1.5 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: STATUS_COLORS[activity.status],
                }}
              />

              <View className="flex-1 gap-1">
                <Text
                  className="text-[12px] font-semibold"
                  style={{ color: colors.textHeading }}
                  numberOfLines={2}
                >
                  {activity.title}
                </Text>

                <Text
                  className="text-[11px]"
                  style={{ color: colors.textSecondary }}
                >
                  {activity.description}
                </Text>

                <Text
                  className="text-[11px]"
                  style={{ color: colors.textSecondary }}
                >
                  {REPORT_STATUS_NAME_BY_STATUS[activity.status]}
                </Text>
              </View>

              <Text className="text-[11px]" style={{ color: colors.textMuted }}>
                {formatActivityDate(activity.date)}
              </Text>
            </View>
          ))
        ) : (
          <Text
            className="px-4 py-6 text-center text-sm"
            style={{ color: colors.textSecondary }}
          >
            Belum ada aktivitas terbaru.
          </Text>
        )}
      </View>
    </View>
  );
}
