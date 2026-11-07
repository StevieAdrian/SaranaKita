import React from 'react';
import { Text, type TextProps } from 'react-native';
import './global.css';
import { AppProviders } from '@/providers';
import { RootNavigator } from '@/navigation/root-navigator';
import { fontFamilies } from '@/shared/theme';

const NativeText = Text as typeof Text & { defaultProps?: TextProps };
NativeText.defaultProps = {
  ...NativeText.defaultProps,
  style: [
    { fontFamily: fontFamilies.regular },
    NativeText.defaultProps?.style,
  ],
};

function App(): React.JSX.Element {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

export default App;
