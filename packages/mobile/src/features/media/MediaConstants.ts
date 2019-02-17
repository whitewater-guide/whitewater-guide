import { Dimensions, PixelRatio, Platform } from 'react-native';
import { BACKEND_URL } from '../../utils/urls';

const window = Dimensions.get('window');
const minDim = Math.min(window.width, window.height);

export const ANDROID_STEP = 20;
export const PHOTO_PADDING = 4;
export const PHOTO_COLUMNS = 4;
export const PHOTO_SIZE = Math.floor(
  (minDim - PHOTO_PADDING * (PHOTO_COLUMNS + 1)) / PHOTO_COLUMNS,
);

const PHOTO_SIZE_PX = PixelRatio.getPixelSizeForLayoutSize(PHOTO_SIZE);
const PHOTO_SIZE_PLATFORM_PX =
  Platform.OS === 'ios'
    ? PHOTO_SIZE_PX
    : Math.ceil(PHOTO_SIZE_PX / ANDROID_STEP) * ANDROID_STEP;

export const getThumbUri = (file: string, size = PHOTO_SIZE_PLATFORM_PX) => ({
  uri: `${BACKEND_URL}/images/${size}/media/${file}`,
});

// Returns is specific format of https://github.com/ascoders/react-native-image-viewer
// IImageInfo (not exported)
export const getUri = (file: string, width?: number, height?: number) => ({
  url: `${BACKEND_URL}/uploads/media/${file}`,
  width,
  height,
});
