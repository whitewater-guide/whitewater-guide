import { PixelRatio } from 'react-native';
import Config from 'react-native-config';
import theme from '../../theme';

const widthPx = PixelRatio.getPixelSizeForLayoutSize(theme.screenWidth);
const widthRounded = [2048, 1600, 1366, 1024, 768, 640].reduce(
  (result, v) => (v >= widthPx ? v : result),
  2048,
);

export function getBannerURL(url: string | null) {
  if (!url) {
    return 'fallback';
  }
  return `${Config.BACKEND_PROTOCOL}://${
    Config.BACKEND_HOST
  }/images/${widthRounded}x/banners/${url}`;
}
