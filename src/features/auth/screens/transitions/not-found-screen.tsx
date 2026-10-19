import React from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import arrowBackIcon from '@/assets/images/404-arrowback.png';
import { authConstants } from '../../constants/auth-constants';

export type NotFoundScreenProps = {
  navigation?: any;
  onGoBack?: () => void;
};

export function NotFoundScreen({
  navigation,
  onGoBack,
}: NotFoundScreenProps): React.JSX.Element {
  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
      return;
    }
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else if (navigation?.navigate) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.textGroup}>
          <Text style={styles.oopsText} accessibilityRole="header">
            Oops!
          </Text>

          <Text style={styles.codeText} accessibilityRole="text">
            404
          </Text>

          <Text style={styles.descriptionText}>
            <Text style={styles.boldDesc}>Halaman ini tidak tersedia.{'\n'}</Text>
            <Text style={styles.normalDesc}>Kembali ke halaman utama.</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke halaman utama"
          style={styles.backButton}
        >
          <Image
            source={arrowBackIcon}
            style={styles.backIcon}
            resizeMode="contain"
            accessibilityElementsHidden
          />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authConstants.colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: authConstants.spacing.screenMargin,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    gap: 29,
  },
  textGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 29,
    width: '100%',
  },
  oopsText: {
    fontFamily: authConstants.typography.errorTitle.fontFamily,
    fontSize: 34,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    fontStyle: Platform.OS === 'ios' ? 'italic' : undefined,
    lineHeight: 38,
    color: authConstants.colors.text.light,
    textAlign: 'center',
  },
  codeText: {
    fontFamily: authConstants.typography.errorCode.fontFamily,
    fontSize: 64,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    color: authConstants.colors.text.light,
    textAlign: 'center',
    lineHeight: 64,
  },
  descriptionText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  boldDesc: {
    fontFamily: authConstants.typography.errorCode.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    color: authConstants.colors.text.light,
  },
  normalDesc: {
    fontFamily: authConstants.typography.label.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: authConstants.colors.text.light,
  },
  backButton: {
    width: '100%',
    maxWidth: 300,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: authConstants.colors.surface,
    borderRadius: 999,
    shadowColor: authConstants.colors.ui.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 6,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  backButtonText: {
    fontFamily: authConstants.typography.buttonText.fontFamily,
    fontSize: 15,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    lineHeight: 22,
    color: authConstants.colors.brand,
  },
});
