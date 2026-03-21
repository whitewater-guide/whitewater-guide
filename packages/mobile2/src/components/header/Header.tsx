import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Appbar } from 'react-native-paper';

import HeaderCenter from './HeaderCenter';
import HeaderLeft from './HeaderLeft';

interface HeaderProps extends NativeStackHeaderProps {
  topLevel: boolean;
}

const Header: React.FC<HeaderProps> = ({
  topLevel,
  navigation,
  options,
  back,
}) => {
  const { headerStyle, headerTitle, headerRight } = options;

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
    // NativeStackHeaderProps types NavigatorID as undefined, so getParent(id) needs a cast
    const parent = (navigation as NavigationProp<ParamListBase>).getParent<
      DrawerNavigationProp<any> | undefined
    >('Drawer');
    parent?.openDrawer();
  }, [navigation]);

  return (
    <Appbar.Header
      mode="center-aligned"
      style={headerStyle as StyleProp<ViewStyle>}
    >
      <HeaderLeft
        topLevel={topLevel}
        canGoBack={!!back}
        onBack={handleBack}
        onMenu={handleMenu}
      />
      <HeaderCenter title={title} />
      {rightElement}
    </Appbar.Header>
  );
};

export default Header;
