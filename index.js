/**
 * @format
 */

import 'react-native-url-polyfill/auto';

// Must be the first import for react-native-gesture-handler / reanimated.
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Native side-effects that must run at startup (e.g. FCM background handler,
// home-screen widget registration) belong here.

AppRegistry.registerComponent(appName, () => App);
