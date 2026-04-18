import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const minDim = Math.min(width, height);

export const PHOTO_COLUMNS = 4;
export const PHOTO_PADDING = 4;
export const PHOTO_SIZE = Math.floor(
  (minDim - PHOTO_PADDING * (PHOTO_COLUMNS + 1)) / PHOTO_COLUMNS,
);
