import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { palette } from '@/shared/theme';

const fontRegular = 'Poppins-Regular';

export type InputProps = TextInputProps & {
  hasError?: boolean;
};

export function Input({
  hasError = false,
  multiline,
  className,
  ...rest
}: InputProps): React.JSX.Element {
  const isEditable = rest.editable !== false;

  return (
    <TextInput
      placeholderTextColor={palette.gray500}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      className={[
        'rounded-lg border px-4 text-base',
        isEditable ? 'bg-field text-gray-900 border-field-border' : 'border-transparent',
        multiline ? 'min-h-[110px] py-3' : 'h-12',
        hasError ? 'border-red-500' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={[
        { fontFamily: fontRegular },
        !isEditable && {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          color: '#1E1E1E',
          borderColor: 'transparent',
          borderWidth: 0,
        },
        rest.style,
      ]}
      {...rest}
    />
  );
}
