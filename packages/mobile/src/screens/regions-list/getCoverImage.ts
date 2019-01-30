import { PixelRatio, Platform } from 'react-native';
import Config from 'react-native-config';
import theme from '../../theme';

const widthPx = PixelRatio.getPixelSizeForLayoutSize(theme.screenWidth);
const widthRounded = [2048, 1600, 1366, 1024, 768, 640].reduce(
  (result, v) => (v >= widthPx ? v : result),
  2048,
);

export default function getCoverImage(cover: string | null) {
  if (!cover) {
    return Platform.OS === 'ios' ? 'fallback' : null;
  }
  return `${Config.BACKEND_PROTOCOL}://${
    Config.BACKEND_HOST
  }/images/${widthRounded}x/covers/${cover}`;
}
