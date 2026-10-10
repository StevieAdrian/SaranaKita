import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { palette } from '@/shared/theme';

export type InputProps = TextInputProps & {
  hasError?: boolean;
};

export function Input({
  hasError = false,
  multiline,
  className,
  ...rest
}: InputProps): React.JSX.Element {
  return (
    <TextInput
      placeholderTextColor={palette.gray500}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      className={[
        'rounded-lg border bg-field px-4 text-base text-gray-900',
        multiline ? 'min-h-[110px] py-3' : 'h-12',
        hasError ? 'border-red-500' : 'border-field-border',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
}
