import React from 'react';
// tslint:disable-next-line:no-submodule-imports
import { HeaderProps } from 'react-navigation-stack/lib/typescript/types';
import Header from './Header';

export const getHeaderRenderer = (topLevel?: boolean) => (
  props: HeaderProps,
) => <Header {...props} topLevel={topLevel} />;
