import { LayoutProvider } from 'recyclerlistview';

import theme from '~/theme';

import { ITEM_HEIGHT } from './constants';

export const layoutProvider = new LayoutProvider(
  () => 0,
  (type, dim) => {
    dim.width = theme.screenWidth;
    dim.height = ITEM_HEIGHT;
  },
);
