module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'transform-inline-environment-variables',
      { include: ['STORYBOOK_ENABLED', 'E2E_MODE'] },
    ],
    'react-native-worklets/plugin',
  ],
};
