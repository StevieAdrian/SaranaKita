import React from 'react';
import { Text, View } from 'react-native';
import {
  REPORT_STATUS,
  ReportStatus,
} from '@/services/report/status.constants';

type ReportProgressProps = {
  status: ReportStatus;
};

const STEPS = [
  {
    status: REPORT_STATUS.WAITING_VERIFICATION,
    label: 'Verifikasi',
  },
  {
    status: REPORT_STATUS.IN_REVIEW,
    label: 'Pemeriksaan',
  },
  {
    status: REPORT_STATUS.IN_REPAIR,
    label: 'Perbaikan',
  },
  {
    status: REPORT_STATUS.DONE,
    label: 'Selesai',
  },
] as const;

export function ReportProgress({
  status,
}: ReportProgressProps): React.JSX.Element {
  const isRejected = status === REPORT_STATUS.REJECTED;
  const currentIndex = STEPS.findIndex(step => step.status === status);
  const progress = isRejected
    ? 0
    : currentIndex >= 0
    ? Math.round(((currentIndex + 1) / STEPS.length) * 100)
    : 0;

  return (
    <View className="gap-3 px-4 pb-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-gray-600">
          {isRejected ? 'Laporan Ditolak' : 'Progres Laporan'}
        </Text>
        <Text className="text-sm font-bold text-gray-900">{progress}%</Text>
      </View>

      <View className="h-2 overflow-hidden rounded-full bg-gray-200">
        <View
          className="h-full rounded-full bg-green-600"
          style={{ width: `${progress}%` }}
        />
      </View>

      <View className="flex-row">
        {STEPS.map((step, index) => {
          const completed = !isRejected && index <= currentIndex;

          return (
            <View key={step.status} className="flex-1 items-center gap-1">
              <View
                className={`h-5 w-5 items-center justify-center rounded-full ${
                  completed ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                {completed && (
                  <Text className="text-xs font-bold text-white">✓</Text>
                )}
              </View>

              <Text
                className={`text-center text-[10px] ${
                  completed ? 'font-semibold text-green-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
