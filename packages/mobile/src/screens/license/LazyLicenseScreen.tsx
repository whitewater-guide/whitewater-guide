import { register } from 'react-native-bundle-splitter';

export const LazyLicenseScreen = register({
  require: () => require('./LicenseScreen'),
});
