import { register } from 'react-native-bundle-splitter';

export const LazyLicenseScreen = register({
  loader: () => import('./LicenseScreen'),
});
