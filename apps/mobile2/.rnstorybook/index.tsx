import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';

import { view } from './storybook.requires';

const StorybookUI = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

function StorybookUIRoot() {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return <StorybookUI />;
}

export default StorybookUIRoot;
