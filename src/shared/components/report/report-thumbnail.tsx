import React from 'react';
import { Image, View } from 'react-native';

export type ReportThumbnailProps = {
  uri: string | null;
  className: string;
};

export function ReportThumbnail({
  uri,
  className,
}: ReportThumbnailProps): React.JSX.Element {
  if (!uri) {
    return (
      <View
        className={`bg-gray-200 ${className}`}
        accessibilityElementsHidden
      />
    );
  }
  return (
    <Image
      source={{ uri }}
      resizeMode="cover"
      className={`bg-gray-200 ${className}`}
      accessibilityIgnoresInvertColors
    />
  );
}
