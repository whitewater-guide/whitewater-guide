import { Dimensions, PixelRatio } from 'react-native';
import Config from 'react-native-config';

const window = Dimensions.get('window');
const minDim = Math.min(window.width, window.height);

export const PHOTO_PADDING = 4;
export const PHOTO_COLUMNS = 4;
export const PHOTO_SIZE = Math.floor((minDim - PHOTO_PADDING * (PHOTO_COLUMNS + 1)) / PHOTO_COLUMNS);
export const PHOTO_SIZE_PX = PixelRatio.getPixelSizeForLayoutSize(PHOTO_SIZE);

export const getThumbUri = (file: string, size = PHOTO_SIZE_PX) => ({
  uri: `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/images/${size}/media/${file}`,
});
export const getUrl = (file: string) => ({
  url: `${Config.BACKEND_PROTOCOL}://${Config.BACKEND_HOST}/uploads/media/${file}`,
});
