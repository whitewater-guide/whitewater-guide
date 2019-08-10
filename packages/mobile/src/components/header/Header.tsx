import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import get from 'lodash/get';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { Appbar } from 'react-native-paper';
import { HeaderProps } from 'react-navigation';
import { useDrawer } from '../drawer/DrawerContext';

const Header: React.FC<HeaderProps> = (props) => {
  const nav = useNavigation();
  const goBack = useCallback(() => nav.goBack(), [nav.goBack]);
  const { t } = useTranslation();
  const toggleDrawer = useDrawer();
  const openDrawer = useCallback(() => toggleDrawer(true), [toggleDrawer]);
  const title = get(props, 'scene.descriptor.options.headerTitle', null);
  const headerRight = get(props, 'scene.descriptor.options.headerRight', null);
  const contentProps = useMemo(
    () => ({
      onPress: () => Keyboard.dismiss(),
    }),
    [],
  );
  let titleNode: React.ReactNode = null;
  if (title) {
    titleNode = typeof title === 'string' ? t(title) : title;
  }
  return (
    <Appbar.Header>
      {props.index ? (
        <Appbar.Action icon="chevron-left" size={36} onPress={goBack} />
      ) : (
        <Appbar.Action icon="menu" onPress={openDrawer} />
      )}
      <Appbar.Content title={titleNode} {...contentProps} />
      {headerRight}
    </Appbar.Header>
  );
};

export default Header;
