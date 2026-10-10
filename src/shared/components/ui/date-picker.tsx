import React, { useState } from 'react';
import { Image, Platform, Pressable, Text } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import calendarIcon from '@/assets/images/calendar.png';
import { palette } from '@/shared/theme';
import { formatDisplayDate } from '@/shared/utils/date';
import { BottomSheet } from './bottom-sheet';
import { Button } from './button';

export type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  accessibilityLabel?: string;
  hasError?: boolean;
};

const NAVY_BUTTON = { backgroundColor: palette.navy } as const;

export function DatePicker({
  value,
  onChange,
  minimumDate,
  maximumDate,
  accessibilityLabel,
  hasError = false,
}: DatePickerProps): React.JSX.Element {
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const display = formatDisplayDate(value);

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'date',
        minimumDate,
        maximumDate,
        onValueChange: (_event, date) => onChange(date),
      });
      return;
    }
    setDraft(value);
    setIosOpen(true);
  };

  const confirmIos = () => {
    onChange(draft);
    setIosOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: display }}
        className={`h-12 flex-row items-center rounded-lg border bg-field px-4 active:opacity-70 ${
          hasError ? 'border-red-500' : 'border-field-border'
        }`}
      >
        <Text numberOfLines={1} className="flex-1 text-base text-gray-900">
          {display}
        </Text>
        <Image source={calendarIcon} resizeMode="contain" className="h-6 w-6" />
      </Pressable>

      {Platform.OS === 'ios' ? (
        <BottomSheet visible={iosOpen} onClose={() => setIosOpen(false)}>
          <DateTimePicker
            value={draft}
            mode="date"
            display="inline"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            accentColor={palette.navy}
            onValueChange={(_event, date) => setDraft(date)}
          />
          <Button title="Pilih" onPress={confirmIos} style={NAVY_BUTTON} />
        </BottomSheet>
      ) : null}
    </>
  );
}
