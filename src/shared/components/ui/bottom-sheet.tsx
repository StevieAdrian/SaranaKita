import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({
  visible,
  onClose,
  children,
}: BottomSheetProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Tutup"
          className="absolute inset-0 bg-black/40"
        />
        <View
          className="max-h-[80%] rounded-t-3xl bg-white px-5 pt-3"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-gray-300" />
          {children}
        </View>
      </View>
    </Modal>
  );
}
