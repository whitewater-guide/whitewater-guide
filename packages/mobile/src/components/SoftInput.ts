import { NativeModules, Platform } from 'react-native';

const { SoftInputModule } = NativeModules;

export enum SoftInputMode {
  ADJUST_PAN,
  ADJUST_RESIZE,
}

let _modes: Record<SoftInputMode, unknown>;

function getModeValue(mode: SoftInputMode) {
  if (!_modes) {
    const { ADJUST_PAN, ADJUST_RESIZE } = SoftInputModule.getConstants();
    _modes = {
      [SoftInputMode.ADJUST_PAN]: ADJUST_PAN,
      [SoftInputMode.ADJUST_RESIZE]: ADJUST_RESIZE,
    };
  }
  return _modes[mode];
}

export function setSoftInputMode(mode: SoftInputMode): void {
  if (Platform.OS === 'android') {
    NativeModules.SoftInputModule.setSoftInputMode(getModeValue(mode));
  }
}
