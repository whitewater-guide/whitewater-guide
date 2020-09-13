import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

import HeaderLeft from '~/components/header/HeaderLeft';
import { SearchContexts } from '~/components/header/types';
import { useHeaderSearch } from '~/components/header/useHeaderSearch';
import theme from '~/theme';

import HeaderCenter from './HeaderCenter';
import HeaderRight from './HeaderRight';
import useHeaderElements from './useHeaderElements';

const styles = StyleSheet.create({
  searchMode: {
    backgroundColor: theme.colors.lightBackground,
  },
});

interface Props extends StackHeaderProps {
  topLevel?: boolean;
  searchContexts?: SearchContexts;
  searchPlaceholderKey?: string;
}

const Header: React.FC<Props> = (props) => {
  const {
    topLevel = true,
    navigation,
    scene,
    searchContexts,
    searchPlaceholderKey,
  } = props;
  const search = useHeaderSearch(searchContexts);

  const { headerLeft, headerRight, title } = useHeaderElements(scene);
  const {
    headerStyle,
    headerTintColor = theme.colors.textLight,
  } = scene.descriptor.options;

  return (
    <Appbar.Header style={[headerStyle, search.active && styles.searchMode]}>
      <HeaderLeft
        hasPrevious={!!props.previous}
        element={headerLeft}
        onBack={navigation.goBack}
        onMenu={(navigation as any).openDrawer}
        headerTintColor={headerTintColor}
        topLevel={topLevel}
        searchActive={search.active}
        setSearchActive={search.setActive}
        setSearchInput={search.setSearchInput}
      />
      <HeaderCenter
        title={title}
        headerTintColor={headerTintColor}
        searchActive={search.active}
        setSearchInput={search.setSearchInput}
        searchString={search.searchInput}
        searchPlaceholderKey={searchPlaceholderKey}
        searchInputRef={search.searchInputRef}
      />
      <HeaderRight
        element={headerRight}
        searchAvailable={search.available}
        searchActive={search.active}
        setSearchInput={search.setSearchInput}
        setSearchActive={search.setActive}
      />
    </Appbar.Header>
  );
};

export default Header;
