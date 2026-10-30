import React from 'react';
import { Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { REPORT_STATUS_META, type ReportStatus } from './report-status';

export type StatusBadgeProps = {
  status: ReportStatus;
  size?: 'sm' | 'md';
};

const DARK_STATUS_STYLE: Record<ReportStatus, { bg: string; text: string; dot: string }> = {
  waiting_verification: { bg: 'rgba(37, 99, 235, 0.25)', text: '#60A5FA', dot: '#60A5FA' },
  in_review: { bg: 'rgba(245, 158, 11, 0.25)', text: '#FBBF24', dot: '#FBBF24' },
  in_repair: { bg: 'rgba(249, 115, 22, 0.25)', text: '#FB923C', dot: '#FB923C' },
  rejected: { bg: 'rgba(239, 68, 68, 0.25)', text: '#F87171', dot: '#F87171' },
  done: { bg: 'rgba(34, 197, 94, 0.25)', text: '#4ADE80', dot: '#4ADE80' },
};

export function StatusBadge({
  status,
  size = 'md',
}: StatusBadgeProps): React.JSX.Element {
  const { scheme } = useRole();
  const isDark = scheme === 'dark';
  const meta = REPORT_STATUS_META[status];
  const isSmall = size === 'sm';
  const darkTheme = isDark ? DARK_STATUS_STYLE[status] : null;

  return (
    <View
      accessible
      accessibilityLabel={`Status: ${meta.label}`}
      style={darkTheme ? { backgroundColor: darkTheme.bg } : undefined}
      className={`flex-row items-center self-start rounded-md ${!isDark ? meta.container : ''
        } ${isSmall ? 'gap-1 px-2 py-0.5' : 'gap-2 px-3 py-1'}`}
    >
      <View
        style={darkTheme ? { backgroundColor: darkTheme.dot } : undefined}
        className={`h-1.5 w-1.5 rounded-full ${!isDark ? meta.dot : ''}`}
      />
      <Text
        style={darkTheme ? { color: darkTheme.text } : undefined}
        className={`${!isDark ? meta.text : ''} ${isSmall ? 'text-[10px]' : 'text-xs'
          } font-medium`}
      >
        {meta.label}
      </Text>
    </View>
  );
}
