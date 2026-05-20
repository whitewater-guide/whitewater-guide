import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../core/navigation';

export type WebViewScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.WEB_VIEW
>;
