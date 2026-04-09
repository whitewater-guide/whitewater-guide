import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

import theme from '../../theme';
import HeaderCenter from './HeaderCenter';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import type { SearchContexts } from './types';
import { useHeaderSearch } from './useHeaderSearch';

const styles = StyleSheet.create({
  searchMode: {
    backgroundColor: theme.colors.lightBackground,
  },
});

interface HeaderProps extends NativeStackHeaderProps {
  topLevel: boolean;
  searchContexts?: SearchContexts;
  searchPlaceholderKey?: string;
}

function Header({
  topLevel,
  navigation,
  options,
  back,
  searchContexts,
  searchPlaceholderKey,
}: HeaderProps) {
  const { headerStyle, headerTitle, headerRight } = options;
  const search = useHeaderSearch(searchContexts);

  const title =
    typeof headerTitle === 'function'
      ? headerTitle({ children: '' })
      : (headerTitle ?? '');

  const rightElement = headerRight
    ? headerRight({ canGoBack: !!back })
    : undefined;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMenu = useCallback(() => {
    const parent = (navigation as NavigationProp<ParamListBase>).getParent<
      DrawerNavigationProp<any> | undefined
    >('Drawer');
    parent?.openDrawer();
  }, [navigation]);

  return (
    <Appbar.Header
      mode="center-aligned"
      style={[
        headerStyle as StyleProp<ViewStyle>,
        search.active && styles.searchMode,
      ]}
    >
      <HeaderLeft
        topLevel={topLevel}
        canGoBack={navigation.canGoBack()}
        onBack={handleBack}
        onMenu={handleMenu}
        searchActive={search.active}
        setSearchActive={search.setActive}
        setSearchInput={search.setSearchInput}
      />
      <HeaderCenter
        title={title}
        searchActive={search.active}
        searchInput={search.searchInput}
        setSearchInput={search.setSearchInput}
        searchInputRef={search.searchInputRef}
        searchPlaceholderKey={searchPlaceholderKey}
      />
      <HeaderRight
        element={rightElement}
        searchAvailable={search.available}
        searchActive={search.active}
        setSearchActive={search.setActive}
        setSearchInput={search.setSearchInput}
      />
    </Appbar.Header>
  );
}

export default Header;
