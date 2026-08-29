import type { Params } from '@storybook/react-native';
import type { ComponentType } from 'react';

export interface StorybookView {
  getStorybookUI: (options?: Partial<Params>) => ComponentType;
}

export const view: StorybookView;
