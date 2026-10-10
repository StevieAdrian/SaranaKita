module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '^@/assets/(.+)': './assets/\\1',
          '^@/(.+)': './src/\\1',
        },
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
      },
    ],
    // react-native-worklets/plugin MUST be listed last.
    'react-native-worklets/plugin',
  ],
};
