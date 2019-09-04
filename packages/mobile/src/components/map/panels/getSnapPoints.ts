import memoize from 'lodash/memoize';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { SnapPoints } from './types';

const getSnapPoints = memoize(
  ([top, mid, btm]: SnapPoints): SnapPoints => {
    const iPhoneXExtra = isIphoneX() ? 18 : 0;
    return [top + iPhoneXExtra, mid + iPhoneXExtra, btm];
  },
);

export default getSnapPoints;
