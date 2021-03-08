import { Dimensions, PixelRatio } from 'react-native';

const window = Dimensions.get('window');
const minDim = Math.min(window.width, window.height);

export const PHOTO_PADDING = 4;
export const PHOTO_COLUMNS = 4;
export const PHOTO_SIZE = Math.floor(
  (minDim - PHOTO_PADDING * (PHOTO_COLUMNS + 1)) / PHOTO_COLUMNS,
);

export const PHOTO_SIZE_PX = PixelRatio.getPixelSizeForLayoutSize(PHOTO_SIZE);
