import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import addPhotoIcon from '@/assets/images/add-photo.png';

export type PickedPhoto = {
  readonly uri: string;
  readonly fileName?: string;
  readonly type?: string;
  readonly fileSize?: number;
};

export type PhotoPickerProps = {
  value: PickedPhoto | null;
  onChange: (photo: PickedPhoto | null) => void;
  title?: string;
  subtitle?: string;
  maxFileSizeBytes?: number;
  hasError?: boolean;
};

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

export function PhotoPicker({
  value,
  onChange,
  title = 'Tambahkan Foto',
  subtitle = 'Klik untuk memilih foto',
  maxFileSizeBytes = DEFAULT_MAX_SIZE,
  hasError = false,
}: PhotoPickerProps): React.JSX.Element {
  const [picking, setPicking] = useState(false);

  const pick = async () => {
    setPicking(true);
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        Alert.alert(
          'Gagal memilih foto',
          result.errorMessage ?? 'Silakan coba lagi.',
        );
        return;
      }
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        return;
      }
      if (asset.fileSize && asset.fileSize > maxFileSizeBytes) {
        const maxMb = Math.round(maxFileSizeBytes / (1024 * 1024));
        Alert.alert('Foto terlalu besar', `Ukuran maksimal ${maxMb} MB.`);
        return;
      }
      onChange({
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
      });
    } finally {
      setPicking(false);
    }
  };

  const borderClass = hasError ? 'border-red-500' : 'border-field-border';

  if (value) {
    return (
      <View
        className={`h-[140px] overflow-hidden rounded-lg border ${borderClass}`}
      >
        <Image
          source={{ uri: value.uri }}
          resizeMode="cover"
          className="h-full w-full"
          accessibilityIgnoresInvertColors
          accessibilityLabel="Foto bukti laporan"
        />
        <View className="absolute bottom-2 right-2 flex-row gap-2">
          <Pressable
            onPress={pick}
            accessibilityRole="button"
            accessibilityLabel="Ganti foto"
            className="min-h-[36px] justify-center rounded-md bg-black/60 px-3 active:opacity-70"
          >
            <Text className="text-sm font-medium text-white">Ganti</Text>
          </Pressable>
          <Pressable
            onPress={() => onChange(null)}
            accessibilityRole="button"
            accessibilityLabel="Hapus foto"
            className="min-h-[36px] justify-center rounded-md bg-black/60 px-3 active:opacity-70"
          >
            <Text className="text-sm font-medium text-white">Hapus</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={pick}
      disabled={picking}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      className={`h-[140px] items-center justify-center rounded-lg border bg-field active:opacity-70 ${borderClass}`}
    >
      {picking ? (
        <ActivityIndicator />
      ) : (
        <>
          <Image
            source={addPhotoIcon}
            resizeMode="contain"
            className="mb-1 h-12 w-12"
          />
          <Text className="text-sm text-gray-600">{title}</Text>
          <Text className="text-xs text-gray-400">{subtitle}</Text>
        </>
      )}
    </Pressable>
  );
}
