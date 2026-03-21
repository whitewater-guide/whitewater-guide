import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Appbar } from 'react-native-paper';

import HeaderCenter from './HeaderCenter';
import HeaderLeft from './HeaderLeft';

interface HeaderProps extends NativeStackHeaderProps {
  topLevel: boolean;
}

function Header({ topLevel, navigation, options, back }: HeaderProps) {
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
        canGoBack={navigation.canGoBack()}
        onBack={handleBack}
        onMenu={handleMenu}
      />
      <HeaderCenter title={title} />
      {rightElement}
    </Appbar.Header>
  );
}

export default Header;
