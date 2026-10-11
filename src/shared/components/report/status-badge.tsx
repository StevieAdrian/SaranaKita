import React from 'react';
import { Text, View } from 'react-native';
import { REPORT_STATUS_META, type ReportStatus } from './report-status';

export type StatusBadgeProps = {
  status: ReportStatus;
  size?: 'sm' | 'md';
};

export function StatusBadge({
  status,
  size = 'md',
}: StatusBadgeProps): React.JSX.Element {
  const meta = REPORT_STATUS_META[status];
  const isSmall = size === 'sm';

  return (
    <View
      accessible
      accessibilityLabel={`Status: ${meta.label}`}
      className={`flex-row items-center self-start rounded-md ${
        meta.container
      } ${isSmall ? 'gap-1 px-2 py-0.5' : 'gap-2 px-3 py-1'}`}
    >
      <View className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      <Text
        className={`${meta.text} ${
          isSmall ? 'text-[10px]' : 'text-xs'
        } font-medium`}
      >
        {meta.label}
      </Text>
    </View>
  );
}
