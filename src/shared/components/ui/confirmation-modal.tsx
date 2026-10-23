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
  variant?: 'bottomSheet' | 'dialog';
  buttonBorderRadius?: number;
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
  variant = 'bottomSheet',
  buttonBorderRadius,
  onConfirm,
  onCancel,
}: ConfirmationModalProps): React.JSX.Element {
  const { theme } = useRole();
  const isDanger = tone === 'danger';
  const isBottomSheet = variant === 'bottomSheet';
  const btnRadius = buttonBorderRadius ?? (isDanger ? 12 : 5);

  const defaultIcon = isDanger ? defaultDeleteIcon : defaultAddIcon;
  const icon = iconSource ?? defaultIcon;

  const iconBgColor = isDanger
    ? '#FEE2E2'
    : isBottomSheet
      ? '#EDE9FE'
      : (confirmColor ? `${confirmColor}1A` : `${theme.primary}1A`);
  const confirmBtnBg = isDanger ? '#EF4444' : (confirmColor ?? theme.primary);
  const confirmTextColor = '#FFFFFF';
  const iconTintColor = isDanger ? '#EF4444' : (confirmColor ?? theme.primary);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isBottomSheet ? 'slide' : 'fade'}
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={loading ? () => { } : onCancel}
    >
      <View style={[styles.overlay, isBottomSheet && styles.overlayBottomSheet]}>
        <TouchableWithoutFeedback onPress={loading ? undefined : onCancel}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            isBottomSheet ? styles.bottomSheetCard : styles.card,
            {
              backgroundColor: theme.surface || '#FFFFFF',
              shadowColor: '#000000',
            },
          ]}
        >
          {isBottomSheet ? <View style={styles.handleBar} /> : null}

          <View
            style={[
              isBottomSheet ? styles.sheetIconCircle : styles.iconCircle,
              { backgroundColor: iconBgColor },
            ]}
          >
            <Image
              source={icon}
              resizeMode="contain"
              style={[
                isBottomSheet ? styles.sheetIconImage : styles.iconImage,
                { tintColor: iconTintColor },
              ]}
            />
          </View>

          <Text
            accessibilityRole="header"
            style={[
              isBottomSheet ? styles.sheetTitle : styles.title,
              { color: theme.textHeading || '#0F172A' },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              isBottomSheet ? styles.sheetMessage : styles.message,
              { color: theme.textSecondary || '#64748B' },
            ]}
          >
            {message}
          </Text>

          {/* Action Buttons */}
          <View style={[styles.buttonGroup, isBottomSheet && styles.sheetButtonGroup]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onConfirm}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              accessibilityState={{ busy: loading }}
              style={[
                isBottomSheet ? styles.sheetConfirmButton : styles.button,
                { backgroundColor: confirmBtnBg },
                isBottomSheet && { borderRadius: btnRadius },
                loading && styles.disabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={confirmTextColor} size="small" />
              ) : (
                <Text
                  style={[
                    isBottomSheet ? styles.sheetConfirmButtonText : styles.buttonText,
                    { color: confirmTextColor },
                  ]}
                >
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
                isBottomSheet ? styles.sheetCancelButton : styles.button,
                styles.cancelButton,
                isBottomSheet && { borderRadius: btnRadius },
                loading && styles.disabled,
              ]}
            >
              <Text
                style={[
                  isBottomSheet ? styles.sheetCancelButtonText : styles.cancelButtonText,
                ]}
              >
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
  overlayBottomSheet: {
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
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
  buttonText: {
    fontFamily: fontBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  bottomSheetCard: {
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 32,
    alignItems: 'center',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  sheetIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sheetIconImage: {
    width: 28,
    height: 28,
  },
  sheetTitle: {
    fontFamily: fontBold,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    textAlign: 'center',
    marginBottom: 4,
  },
  sheetMessage: {
    fontFamily: fontRegular,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  sheetButtonGroup: {
    width: '100%',
    gap: 8,
  },
  sheetConfirmButton: {
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  sheetConfirmButtonText: {
    fontFamily: fontSemiBold,
    fontSize: 15,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  sheetCancelButton: {
    height: 44,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  sheetCancelButtonText: {
    fontFamily: fontSemiBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: '#64748B',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
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
