import { LiteUI } from '@storybook/react-native-ui-lite';
import { createMMKV } from 'react-native-mmkv';

import { view } from './storybook.requires';

const storybookStorage = createMMKV({ id: 'storybook-ui' });

function getStorybookItem(key: string): string | null {
  return storybookStorage.getString(key) ?? null;
}

function setStorybookItem(key: string, value: string): void {
  storybookStorage.set(key, value);
}

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  CustomUIComponent: LiteUI,
  storage: {
    getItem: getStorybookItem,
    setItem: setStorybookItem,
  },
});

export default StorybookUIRoot;
