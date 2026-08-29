import { LiteUI } from '@storybook/react-native-ui-lite';

import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: false,
  CustomUIComponent: LiteUI,
});

export default StorybookUIRoot;
