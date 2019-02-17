import { PixelRatio } from 'react-native';
import theme from '../../theme';
import { BACKEND_URL } from '../../utils/urls';

const widthPx = PixelRatio.getPixelSizeForLayoutSize(theme.screenWidth);
const widthRounded = [2048, 1600, 1366, 1024, 768, 640].reduce(
  (result, v) => (v >= widthPx ? v : result),
  2048,
);

export function getBannerURL(url: string | null) {
  if (!url) {
    return 'fallback';
  }
  return `${BACKEND_URL}/images/${widthRounded}x/banners/${url}`;
}
