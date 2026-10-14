import React from 'react';
import { Image, Text, View } from 'react-native';
import checkIcon from '@/assets/images/check.png';
import { palette } from '@/shared/theme';
import { REPORT_STATUS_META, type ReportStatus } from './report-status';
import { PROGRESS_STEPS, REPORT_PROGRESS } from './report-progress-meta';

export type ReportProgressProps = {
  status: ReportStatus;
};

const INACTIVE = '#E2E8F0';
const INACTIVE_DOT = '#94A3B8';
const CHECK_TINT = { tintColor: palette.white } as const;
const HIDDEN_LINE = { backgroundColor: 'transparent' } as const;
const INACTIVE_FILL = { backgroundColor: INACTIVE } as const;
const INACTIVE_DOT_FILL = { backgroundColor: INACTIVE_DOT } as const;

export function ReportProgress({
  status,
}: ReportProgressProps): React.JSX.Element {
  const { completedSteps, color } = REPORT_PROGRESS[status];
  const activeFill = { backgroundColor: color };
  const activeText = { color };

  const lineStyle = (visible: boolean, active: boolean) =>
    !visible ? HIDDEN_LINE : active ? activeFill : INACTIVE_FILL;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Progres laporan: ${REPORT_STATUS_META[status].label}`}
      accessibilityValue={{
        min: 0,
        max: PROGRESS_STEPS.length,
        now: completedSteps,
      }}
      className="flex-row"
    >
      {PROGRESS_STEPS.map((label, index) => {
        const done = index < completedSteps;
        const isFirst = index === 0;
        const isLast = index === PROGRESS_STEPS.length - 1;
        return (
          <View key={label} className="flex-1 items-center">
            <View className="h-7 w-full flex-row items-center">
              <View
                className="h-[3px] flex-1"
                style={lineStyle(!isFirst, done)}
              />
              <View
                className="h-7 w-7 items-center justify-center rounded-full"
                style={done ? activeFill : INACTIVE_FILL}
              >
                {done ? (
                  <Image
                    source={checkIcon}
                    resizeMode="contain"
                    className="h-3.5 w-3.5"
                    style={CHECK_TINT}
                  />
                ) : (
                  <View
                    className="h-1.5 w-1.5 rounded-full"
                    style={INACTIVE_DOT_FILL}
                  />
                )}
              </View>
              <View
                className="h-[3px] flex-1"
                style={lineStyle(!isLast, index + 1 < completedSteps)}
              />
            </View>
            <Text
              numberOfLines={1}
              className={`mt-1.5 text-[11px] ${
                done ? 'font-semibold' : 'text-gray-400'
              }`}
              style={done ? activeText : undefined}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
