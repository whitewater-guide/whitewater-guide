import React from 'react';
import { HeaderProps } from 'react-navigation';
import Header from './Header';

export const getHeaderRenderer = (topLevel?: boolean) => (
  props: HeaderProps,
) => <Header {...props} topLevel={topLevel} />;
