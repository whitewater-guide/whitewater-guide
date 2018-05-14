import clamp from 'lodash/clamp';
import { Dimensions } from 'react-native';

const getTitleFontSize = (title: string) => {
  const letters = title.length;
  const fontSize = 1.8 * (Dimensions.get('window').width - 140) / letters;
  return clamp(fontSize, 12, 20);
};

export default getTitleFontSize;
