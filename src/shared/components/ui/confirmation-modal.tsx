import React from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import defaultAddIcon from '@/assets/images/vector-popup-addpengguna.png';
import defaultDeleteIcon from '@/assets/images/vector-deletepopup.png';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';

export type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  iconSource?: ImageSourcePropType;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Batal',
  tone = 'primary',
  iconSource,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps): React.JSX.Element {
  const { theme } = useRole();
  const isDanger = tone === 'danger';

  const defaultIcon = isDanger ? defaultDeleteIcon : defaultAddIcon;
  const icon = iconSource ?? defaultIcon;

  const iconBgColor = isDanger ? theme.dangerSurface : theme.backgroundSubtle;
  const confirmBtnBg = isDanger ? theme.danger : theme.primary;
  const confirmTextColor = theme.onPrimary;

  return (
    // PopUp
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={loading ? () => { } : onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={loading ? undefined : onCancel}
          accessibilityRole="button"
          accessibilityLabel="Tutup dialog"
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.borderSubtle,
              shadowColor: theme.shadowColor,
            },
          ]}
        >

          <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
            <Image source={icon} resizeMode="contain" style={styles.iconImage} />
          </View>

          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.textHeading }]}
          >
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {message}
          </Text>

          {/* Button */}
          <View style={styles.buttonGroup}>
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              accessibilityState={{ busy: loading }}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: confirmBtnBg },
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={confirmTextColor} size="small" />
              ) : (
                <Text style={[styles.buttonText, { color: confirmTextColor }]}>
                  {confirmLabel}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={onCancel}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: theme.surfaceInput,
                  borderColor: theme.borderInput,
                },
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
                {cancelLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconImage: {
    width: 36,
    height: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  buttonGroup: {
    width: '100%',
    gap: spacing.sm,
  },
  button: {
    minHeight: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  cancelButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
});
