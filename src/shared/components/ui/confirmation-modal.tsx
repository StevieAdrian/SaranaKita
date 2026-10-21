import React from 'react';
import { ActivityIndicator, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, type ImageSourcePropType } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import defaultAddIcon from '@/assets/images/vector-popup-addpengguna.png';
import defaultDeleteIcon from '@/assets/images/vector-deletepopup.png';

export type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  confirmColor?: string;
  iconSource?: ImageSourcePropType;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const fontBold = 'Poppins-Bold';
const fontSemiBold = 'Poppins-SemiBold';
const fontRegular = 'Poppins-Regular';

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Batal',
  tone = 'primary',
  confirmColor,
  iconSource,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps): React.JSX.Element {
  const { theme } = useRole();
  const isDanger = tone === 'danger';

  const defaultIcon = isDanger ? defaultDeleteIcon : defaultAddIcon;
  const icon = iconSource ?? defaultIcon;

  const iconBgColor = isDanger
    ? '#FEE2E2'
    : (confirmColor ? `${confirmColor}1A` : `${theme.primary}1A`);
  const confirmBtnBg = isDanger ? '#EF4444' : (confirmColor ?? theme.primary);
  const confirmTextColor = '#FFFFFF';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={loading ? () => { } : onCancel}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={loading ? undefined : onCancel}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface || '#FFFFFF',
              shadowColor: theme.shadowColor || '#000000',
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
            <Image source={icon} resizeMode="contain" style={styles.iconImage} />
          </View>

          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.textHeading || '#0F172A' }]}
          >
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary || '#64748B' }]}>
            {message}
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onConfirm}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              accessibilityState={{ busy: loading }}
              style={[
                styles.button,
                { backgroundColor: confirmBtnBg },
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
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onCancel}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              style={[
                styles.button,
                styles.cancelButton,
                loading && styles.disabled,
              ]}
            >
              <Text style={styles.cancelButtonText}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: fontBold,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontFamily: fontRegular,
    fontSize: 12.5,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  button: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  buttonText: {
    fontFamily: fontBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  cancelButtonText: {
    fontFamily: fontSemiBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: '#64748B',
  },
  disabled: {
    opacity: 0.6,
  },
});
