import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import maleDefault from '@/assets/images/male-default.png';
import vectorEdit from '@/assets/images/vector-edit.png';
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
  gender?: Gender | null | string;
  photo: PickedPhoto | null;
  onChange: (photo: PickedPhoto | null) => void;
  disabled?: boolean;
};

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export function AvatarPicker({
  gender,
  photo,
  onChange,
  disabled = false,
}: AvatarPickerProps): React.JSX.Element {
  const [picking, setPicking] = useState(false);

  const defaultAvatarSource =
    gender === 'Female' ? womanDefault : maleDefault;

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
        {photo?.uri ? (
          <Image
            source={{ uri: photo.uri }}
            style={styles.avatarImage}
            resizeMode="cover"
            accessibilityRole="image"
            accessibilityLabel="Profile Avatar"
          />
        ) : (
          <Image
            source={defaultAvatarSource}
            style={styles.defaultAvatarImage}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel="Profile Avatar"
          />
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePick}
        disabled={disabled || picking}
        accessibilityRole="button"
        accessibilityLabel="Pilih Foto Profil"
        style={styles.cameraBadge}
      >
        {picking ? (
          <ActivityIndicator size="small" color={authConstants.colors.brand} />
        ) : (
          <Image
            source={vectorEdit}
            style={styles.cameraIcon}
            resizeMode="contain"
            accessibilityElementsHidden
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: authConstants.components.avatar.size,
    height: 136,
    alignSelf: 'center',
    position: 'relative',
  },
  avatarFrame: {
    width: authConstants.components.avatar.size,
    height: authConstants.components.avatar.size,
    borderRadius: authConstants.components.avatar.radius,
    backgroundColor: authConstants.colors.ui.avatarBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  avatarImage: {
    width: authConstants.components.avatar.size,
    height: authConstants.components.avatar.size,
  },
  defaultAvatarImage: {
    width: authConstants.components.avatar.defaultWidth,
    height: authConstants.components.avatar.defaultHeight,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: authConstants.components.avatar.badgeSize,
    height: authConstants.components.avatar.badgeSize,
    borderRadius: authConstants.components.avatar.badgeRadius,
    backgroundColor: authConstants.colors.ui.badgeBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: authConstants.colors.ui.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  cameraIcon: {
    width: 18,
    height: 18,
    tintColor: authConstants.colors.text.dark,
  },
});
