import { NAVIGATE_BUTTON_HEIGHT } from '~/components/NavigateButton';
import theme from '../../../../theme';

export const ITEM_HEIGHT = NAVIGATE_BUTTON_HEIGHT;
export const ROWS_PER_SCREEN = Math.ceil(theme.tabScreenHeight / ITEM_HEIGHT);
