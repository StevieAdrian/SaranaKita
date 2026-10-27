import React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  REPORT_STATUS,
  type ReportDashboard,
  type ReportStatus,
} from '@/services/report';
import { REPORT_STATUS_META } from '@/shared/components/report/report-status';
import { palette } from '@/shared/theme';
import { toDisplayDate } from '../utils/feed';

export const REPORT_STATUS_ROWS: readonly {
  status: ReportStatus;
  label: string;
  color: string;
}[] = [
  {
    status: REPORT_STATUS.WAITING_VERIFICATION,
    label: REPORT_STATUS_META[REPORT_STATUS.WAITING_VERIFICATION].label,
    color: palette.brand,
  },
  {
    status: REPORT_STATUS.IN_REVIEW,
    label: REPORT_STATUS_META[REPORT_STATUS.IN_REVIEW].label,
    color: palette.warning,
  },
  {
    status: REPORT_STATUS.IN_REPAIR,
    label: REPORT_STATUS_META[REPORT_STATUS.IN_REPAIR].label,
    color: palette.brown,
  },
  {
    status: REPORT_STATUS.REJECTED,
    label: REPORT_STATUS_META[REPORT_STATUS.REJECTED].label,
    color: palette.danger,
  },
  {
    status: REPORT_STATUS.DONE,
    label: REPORT_STATUS_META[REPORT_STATUS.DONE].label,
    color: palette.greenStatus,
  },
];

function formatLongDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ReportStatusSummary({
  dashboard,
  variant,
  selectedStatus,
  onStatusPress,
}: {
  dashboard: Pick<
    ReportDashboard,
    'generatedAt' | 'totalReports' | 'statusCounts'
  >;
  variant: 'staff' | 'administrator';
  selectedStatus?: ReportStatus;
  onStatusPress?: (status: ReportStatus) => void;
}): React.JSX.Element {
  const isStaff = variant === 'staff';
  const panelClass = isStaff ? 'gap-3 rounded-lg bg-white p-4 shadow-sm' : 'gap-3 rounded-lg bg-white/10 p-4';
  const headingClass = isStaff ? 'text-sm font-semibold text-gray-800' : 'text-sm font-semibold text-white';
  const dateClass = isStaff ? 'text-[10px] text-slate-400' : 'text-[10px] text-white/80';
  const trackClass = isStaff ? 'bg-slate-100' : 'bg-white/10';
  const labelClass = isStaff ? 'text-slate-700' : 'text-white';
  const percentClass = isStaff ? 'text-slate-400' : 'text-white';

  return (
    <View className={isStaff ? 'gap-3' : undefined}>
      {isStaff ? (
        <Text className="text-base font-bold text-gray-900">
          Data Status Laporan Bulan Ini
        </Text>
      ) : null}
      <View className={panelClass}>
        <View className="flex-row items-center justify-between">
          <Text className={headingClass}>
            {dashboard.totalReports} Laporan Masuk
          </Text>
          <Text className={dateClass}>
            {isStaff ? 'Data Terakhir: ' : 'Data terakhir: '}
            {isStaff
              ? formatLongDate(dashboard.generatedAt)
              : toDisplayDate(dashboard.generatedAt)}
          </Text>
        </View>
        <View
          className={`h-2 flex-row overflow-hidden rounded-full ${trackClass}`}
        >
          {REPORT_STATUS_ROWS.map(row => {
            const percent =
              dashboard.totalReports > 0
                ? (dashboard.statusCounts[row.status] / dashboard.totalReports) *
                  100
                : 0;
            return percent > 0 ? (
              <View
                key={row.status}
                style={{ width: `${percent}%`, backgroundColor: row.color }}
              />
            ) : null;
          })}
        </View>
        <View className="gap-2">
          {REPORT_STATUS_ROWS.map(row => {
            const count = dashboard.statusCounts[row.status];
            const percent = dashboard.totalReports > 0 ? Math.round((count / dashboard.totalReports) * 100) : 0;
            const rowClass = `min-h-5 flex-row items-center rounded px-1 py-0.5 ${
              selectedStatus === row.status ? 'bg-white/10' : ''
            }`;
            const content = (
              <>
                <View className="flex-1 flex-row items-center gap-2">
                  <View
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  <Text className={`text-xs ${labelClass}`}>{row.label}</Text>
                </View>
                <Text className={`w-8 text-center text-xs ${labelClass}`}>
                  {count}
                </Text>
                <Text className={`w-9 text-right text-xs ${percentClass}`}>
                  {percent}%
                </Text>
              </>
            );

            return onStatusPress ? (
              <Pressable
                key={row.status}
                onPress={() => onStatusPress(row.status)}
                accessibilityRole="button"
                accessibilityState={{
                  selected: selectedStatus === row.status,
                }}
                className={rowClass}
              >
                {content}
              </Pressable>
            ) : (
              <View key={row.status} className={rowClass}>
                {content}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
