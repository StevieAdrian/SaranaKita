import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import addPhotoIcon from '@/assets/images/add-photo.png';
import maleDefault from '@/assets/images/male-default.png';
import womanDefault from '@/assets/images/woman-default.png';
import { authConstants } from '../constants/auth-constants';
import type { Gender } from '../types';

export type PickedPhoto = {
  readonly uri: string;
  readonly fileName?: string;
  readonly type?: string;
  readonly fileSize?: number;
};

export type AvatarPickerProps = {
  gender?: Gender | string;
  photo: PickedPhoto | null;
  onChange: (photo: PickedPhoto | null) => void;
  disabled?: boolean;
};

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export function AvatarPicker({
  gender = 'Female',
  photo,
  onChange,
  disabled = false,
}: AvatarPickerProps): React.JSX.Element {
  const [picking, setPicking] = useState(false);

  const defaultAvatarSource =
    gender === 'Male' ? maleDefault : womanDefault;

  const handlePick = async () => {
    if (disabled || picking) return;

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
          'Gagal Memilih Foto',
          result.errorMessage ?? 'Silakan coba lagi.',
        );
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        return;
      }

      if (asset.fileSize && asset.fileSize > MAX_PHOTO_SIZE_BYTES) {
        Alert.alert('Foto Terlalu Besar', 'Ukuran foto maksimal adalah 5 MB.');
        return;
      }

      onChange({
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
      });
    } catch {
      Alert.alert('Gagal Memilih Foto', 'Terjadi kesalahan saat membuka galeri.');
    } finally {
      setPicking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarFrame}>
        <Image
          source={photo?.uri ? { uri: photo.uri } : defaultAvatarSource}
          style={styles.avatarImage}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel="Profile Avatar"
        />
      </View>

      <Pressable
        onPress={handlePick}
        disabled={disabled || picking}
        accessibilityRole="button"
        accessibilityLabel="Pilih Foto Profil"
        style={({ pressed }) => [
          styles.cameraBadge,
          pressed && styles.cameraBadgePressed,
        ]}
      >
        {picking ? (
          <ActivityIndicator size="small" color="#1A73E8" />
        ) : (
          <Image
            source={addPhotoIcon}
            style={styles.cameraIcon}
            resizeMode="contain"
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: authConstants.components.avatar.size,
    height: authConstants.components.avatar.size,
    alignSelf: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  avatarFrame: {
    width: authConstants.components.avatar.size,
    height: authConstants.components.avatar.size,
    borderRadius: authConstants.components.avatar.radius,
    backgroundColor: authConstants.colors.ui.avatarBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: authConstants.components.avatar.size,
    height: authConstants.components.avatar.size,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: authConstants.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: authConstants.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  cameraBadgePressed: {
    opacity: 0.75,
  },
  cameraIcon: {
    width: 20,
    height: 20,
  },
});
