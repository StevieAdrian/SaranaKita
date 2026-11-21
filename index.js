/**
 * @format
 */

import 'react-native-url-polyfill/auto';

// Must be the first import for react-native-gesture-handler / reanimated.
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';

// This must be registered outside React so Android can handle data messages
// while the app is in the background or terminated.
messaging().setBackgroundMessageHandler(async () => {});

AppRegistry.registerComponent(appName, () => App);
