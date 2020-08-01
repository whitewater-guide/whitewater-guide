import { Platform } from 'react-native';
import KeyboardSpacerAndroid from './KeyboardSpacerAndroid';
import KeyboardSpacerIos from './KeyboardSpacerIos';

const KeyboardSpacer =
  Platform.OS === 'ios' ? KeyboardSpacerIos : KeyboardSpacerAndroid;

export default KeyboardSpacer;
