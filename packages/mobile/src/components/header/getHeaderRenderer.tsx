import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';

import Header from './Header';
import { SearchContexts } from './types';

export const getHeaderRenderer =
  (
    topLevel?: boolean,
    searchContexts?: SearchContexts,
    searchPlaceholderKey?: string,
    // eslint-disable-next-line react/display-name
  ) =>
  (props: StackHeaderProps) =>
    (
      <Header
        {...props}
        topLevel={topLevel}
        searchContexts={searchContexts}
        searchPlaceholderKey={searchPlaceholderKey}
      />
    );
