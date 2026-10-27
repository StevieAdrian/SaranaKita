import React, { useState } from 'react';
import { Image, Keyboard, Platform, Pressable, Text } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import calendarSignupLogo from '@/assets/images/calender-signup-logo.png';
import { KEYBOARD_DISMISS_DELAY_MS } from '@/shared/constants';
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
    Keyboard.dismiss();
    setTimeout(() => {
      const safeDate =
        value instanceof Date && !isNaN(value.getTime())
          ? value
          : new Date(2005, 0, 1);

      if (Platform.OS === 'android') {
        try {
          DateTimePickerAndroid.open({
            value: safeDate,
            mode: 'date',
            minimumDate,
            maximumDate,
            positiveButton: { label: 'OK', textColor: '#2563EB' },
            negativeButton: { label: 'Batal', textColor: '#2563EB' },
            onValueChange: (_event, date) => {
              if (date) {
                onChange(date);
              }
            },
            onChange: (_event, date) => {
              if (date) {
                onChange(date);
              }
            },
          });
        } catch (err) {
          console.warn('DateTimePicker error:', err);
        }
        return;
      }
      setDraft(safeDate);
      setIosOpen(true);
    }, KEYBOARD_DISMISS_DELAY_MS);
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
        className={`h-12 flex-row items-center rounded-lg border bg-field px-4 active:opacity-70 ${hasError ? 'border-red-500' : 'border-field-border'}`}
      >
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#1E1E1E' }}
          className="flex-1"
        >
          {display}
        </Text>
        <Image
          source={calendarSignupLogo}
          resizeMode="contain"
          style={{ width: 14, height: 16, tintColor: '#828282' }}
        />
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
