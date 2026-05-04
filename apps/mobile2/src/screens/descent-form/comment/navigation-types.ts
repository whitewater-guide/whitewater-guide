import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamsList, Screens } from '../../../core/navigation';

export type DescentFormCommentScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.DESCENT_FORM_COMMENT
>;
