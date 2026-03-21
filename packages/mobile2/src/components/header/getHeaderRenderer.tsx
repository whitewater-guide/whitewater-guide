import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';

import Header from './Header';

export const getHeaderRenderer =
  (isTopLevel = false) =>
  (props: NativeStackHeaderProps) => (
    <Header {...props} topLevel={isTopLevel} />
  );
