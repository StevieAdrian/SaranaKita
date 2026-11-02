import React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { useRole } from '@/shared/context/theme-context';

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
  const { theme } = useRole();
  const isEditable = rest.editable !== false;

  return (
    <TextInput
      placeholderTextColor={theme.textPlaceholder}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      className={[
        'rounded-lg border px-4 text-base',
        multiline ? 'min-h-[110px] py-3' : 'h-12',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={[
        {
          fontFamily: fontRegular,
          fontSize: 14,
          color: theme.textInput,
          backgroundColor: isEditable ? theme.surfaceInput : theme.overlayDisabled,
          borderColor: hasError ? theme.danger : (isEditable ? theme.borderInput : 'transparent'),
          borderWidth: isEditable ? 1 : 0,
        },
        rest.style,
      ]}
      {...rest}
    />
  );
}
