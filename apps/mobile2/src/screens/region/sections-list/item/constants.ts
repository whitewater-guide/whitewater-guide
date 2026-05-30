import { Dimensions } from 'react-native';

import { NAVIGATE_BUTTON_HEIGHT } from '../../../../components/NavigateButton';

export const ITEM_HEIGHT = NAVIGATE_BUTTON_HEIGHT;
export const ROWS_PER_SCREEN = Math.ceil(
  Dimensions.get('window').height / ITEM_HEIGHT,
);
export const SECTIONS_LIST_SUBTITLE_HEIGHT = 32;
