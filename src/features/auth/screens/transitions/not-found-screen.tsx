import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import leftArrow from '@/assets/images/left-arrow.png';
import { authConstants } from '../../constants/auth-constants';

export type NotFoundScreenProps = {
  onGoBack?: () => void;
};

export function NotFoundScreen({
  onGoBack,
}: NotFoundScreenProps): React.JSX.Element {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.oopsText} accessibilityRole="header">
          Oops!
        </Text>

        <Text style={styles.codeText} accessibilityRole="text">
          404
        </Text>

        <Text style={styles.descriptionText}>
          {'Halaman ini tidak tersedia.\nKembali ke halaman utama.'}
        </Text>

        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke halaman sebelumnya"
          style={({ pressed }) => [
            styles.roundBackButton,
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={leftArrow}
            style={styles.backIcon}
            resizeMode="contain"
            accessibilityElementsHidden
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authConstants.colors.backgroundBlue,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: authConstants.spacing.screenMargin,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  oopsText: {
    fontFamily: authConstants.typography.errorTitle.fontFamily,
    fontSize: 34,
    fontWeight: '700',
    fontStyle: 'italic',
    color: authConstants.colors.text.light,
    textAlign: 'center',
    marginBottom: 4,
  },
  codeText: {
    fontFamily: authConstants.typography.errorCode.fontFamily,
    fontSize: 68,
    fontWeight: '700',
    color: authConstants.colors.text.light,
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 76,
    marginBottom: 12,
  },
  descriptionText: {
    fontFamily: authConstants.typography.subtitle.fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: authConstants.colors.text.light,
    textAlign: 'center',
    marginBottom: 28,
  },
  roundBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: authConstants.colors.text.light,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: authConstants.colors.text.light,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
});
