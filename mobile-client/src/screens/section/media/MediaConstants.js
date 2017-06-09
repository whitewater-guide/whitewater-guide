import { Dimensions, PixelRatio } from 'react-native';
import Config from 'react-native-config';

const window = Dimensions.get('window');
const minDim = Math.min(window.width, window.height);

export const PHOTO_PADDING = 4;
export const PHOTO_COLUMNS = 4;
export const PHOTO_SIZE = Math.floor((minDim - PHOTO_PADDING * (PHOTO_COLUMNS + 1)) / PHOTO_COLUMNS);
export const PHOTO_SIZE_PX = PixelRatio.getPixelSizeForLayoutSize(PHOTO_SIZE);
export const THUMBS_BASE = `${Config.HOST}/thumbs`;
export const IMAGES_BASE = `${Config.HOST}/images`;

export const getThumbUri = (url, size = PHOTO_SIZE_PX) => ({ uri: `${THUMBS_BASE}/${size}/${url}` });
export const getUrl = url => ({ url: `${IMAGES_BASE}/${url}` });
