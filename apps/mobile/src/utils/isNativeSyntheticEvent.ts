import type { NativeSyntheticEvent } from 'react-native';

const isNativeSyntheticEvent = (e: any): e is NativeSyntheticEvent<any> =>
  'nativeEvent' in e;

export default isNativeSyntheticEvent;
