import HeaderLeft from 'components/header/HeaderLeft';
import get from 'lodash/get';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
// tslint:disable-next-line:no-submodule-imports
import { HeaderProps } from 'react-navigation-stack/lib/typescript/types';
import theme from '../../theme';
import { useDrawer } from '../drawer/DrawerContext';

interface Props extends HeaderProps {
  topLevel?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { topLevel = true } = props;
  const nav = useNavigation();
  const goBack = useCallback(() => nav.goBack(null), [nav.goBack]);
  const { t } = useTranslation();
  const toggleDrawer = useDrawer();
  const openDrawer = useCallback(() => toggleDrawer(true), [toggleDrawer]);
  const title = get(props, 'scene.descriptor.options.headerTitle', null);
  const headerLeft = get(
    props,
    'scene.descriptor.options.headerLeft',
    undefined,
  );
  const headerRight = get(
    props,
    'scene.descriptor.options.headerRight',
    undefined,
  );
  const headerStyle = get(props, 'scene.descriptor.options.headerStyle');
  const headerTintColor = get(
    props,
    'scene.descriptor.options.headerTintColor',
    theme.colors.textLight,
  );
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
    <Appbar.Header style={headerStyle}>
      <HeaderLeft
        index={props.scene.index}
        headerLeft={headerLeft}
        onBack={goBack}
        onMenu={openDrawer}
        headerTintColor={headerTintColor}
        topLevel={topLevel}
      />
      <Appbar.Content
        title={titleNode}
        {...contentProps}
        color={headerTintColor}
      />
      {headerRight}
    </Appbar.Header>
  );
};

export default Header;
