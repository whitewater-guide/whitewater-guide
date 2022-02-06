import { NativeModules } from 'react-native';

const { SoftInputModule } = NativeModules;

const { ADJUST_PAN, ADJUST_RESIZE } = SoftInputModule.getConstants();

export enum SoftInputMode {
  ADJUST_PAN,
  ADJUST_RESIZE,
}

const modes = {
  [SoftInputMode.ADJUST_PAN]: ADJUST_PAN,
  [SoftInputMode.ADJUST_RESIZE]: ADJUST_RESIZE,
};

export function setSoftInputMode(mode: SoftInputMode): void {
  NativeModules.SoftInputModule.setSoftInputMode(modes[mode]);
}
