import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import addPhotoIcon from '@/assets/images/add-photo.png';
import { useRole } from '@/shared/context/theme-context';
import { Toast } from './toast';

export type PickedPhoto = {
  readonly uri: string;
  readonly fileName?: string;
  readonly type?: string;
  readonly fileSize?: number;
};

export type PhotoPickerProps = {
  value: PickedPhoto | null;
  onChange: (photo: PickedPhoto | null) => void;
  onError?: (message: string) => void;
  title?: string;
  subtitle?: string;
  maxFileSizeBytes?: number;
  hasError?: boolean;
};

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

export function PhotoPicker({
  value,
  onChange,
  onError,
  title = 'Tambahkan Foto',
  subtitle = 'Klik untuk memilih foto',
  maxFileSizeBytes = DEFAULT_MAX_SIZE,
  hasError = false,
}: PhotoPickerProps): React.JSX.Element {
  const { theme } = useRole();
  const [picking, setPicking] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const reportError = (message: string) => {
    if (onError) {
      onError(message);
    } else {
      setToast({ visible: true, message });
    }
  };

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
        reportError(
          result.errorMessage ?? 'Gagal memilih foto. Silakan coba lagi.',
        );
        return;
      }
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        return;
      }
      if (asset.fileSize && asset.fileSize > maxFileSizeBytes) {
        const maxMb = Math.round(maxFileSizeBytes / (1024 * 1024));
        reportError(`Foto terlalu besar. Ukuran maksimal ${maxMb} MB.`);
        return;
      }
      onChange({
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
      });
    } catch {
      reportError('Gagal memilih foto. Silakan coba lagi.');
    } finally {
      setPicking(false);
    }
  };

  if (value) {
    return (
      <View
        style={{ borderColor: hasError ? theme.danger : theme.borderInput }}
        className="h-[140px] overflow-hidden rounded-lg border"
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
        {!onError ? (
          <Toast
            visible={toast.visible}
            message={toast.message}
            type="error"
            onDismiss={() => setToast({ visible: false, message: '' })}
          />
        ) : null}
      </View>
    );
  }

  return (
    <>
      <Pressable
        onPress={pick}
        disabled={picking}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={subtitle}
        style={{
          backgroundColor: theme.surfaceInput,
          borderColor: hasError ? theme.danger : theme.borderInput,
        }}
        className="h-[140px] items-center justify-center rounded-lg border active:opacity-70"
      >
        {picking ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <>
            <Image
              source={addPhotoIcon}
              resizeMode="contain"
              className="mb-1 h-12 w-12"
            />
            <Text style={{ color: theme.textSecondary }} className="text-sm">{title}</Text>
            <Text style={{ color: theme.textMuted }} className="text-xs">{subtitle}</Text>
          </>
        )}
      </Pressable>
      {!onError ? (
        <Toast
          visible={toast.visible}
          message={toast.message}
          type="error"
          onDismiss={() => setToast({ visible: false, message: '' })}
        />
      ) : null}
    </>
  );
}
