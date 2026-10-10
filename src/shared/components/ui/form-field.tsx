import React from 'react';
import { Text, View } from 'react-native';

export type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export function FormField({
  label,
  required = false,
  error,
  children,
}: FormFieldProps): React.JSX.Element {
  return (
    <View className="gap-2">
      <Text className="text-base font-medium text-gray-900">
        {label}
        {required ? <Text className="text-red-500"> *</Text> : null}
      </Text>
      {children}
      {error ? (
        <Text accessibilityLiveRegion="polite" className="text-sm text-red-500">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
