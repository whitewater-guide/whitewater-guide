import type { NativeStackHeaderProps } from '@react-navigation/native-stack';

import Header from './Header';
import type { SearchContexts } from './types';

export const getHeaderRenderer =
  (
    isTopLevel = false,
    searchContexts?: SearchContexts,
    searchPlaceholderKey?: string,
  ) =>
  (props: NativeStackHeaderProps) => (
    <Header
      {...props}
      topLevel={isTopLevel}
      searchContexts={searchContexts}
      searchPlaceholderKey={searchPlaceholderKey}
    />
  );
