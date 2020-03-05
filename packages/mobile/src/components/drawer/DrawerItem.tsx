import React, { useCallback } from 'react';
import { Drawer } from 'react-native-paper';

interface Props {
  focused: boolean;
  label: string;
  routeName: string;
  icon?: string;
  navKey?: string;
  params?: Record<string, any>;
  onPress: (
    routeName: string,
    params?: Record<string, any>,
    key?: string,
  ) => void;
}

const DrawerItem: React.FC<Props> = React.memo((props) => {
  const { focused, label, routeName, icon, navKey, params, onPress } = props;

  const onTap = useCallback(() => {
    onPress(routeName, params, navKey);
  }, [onPress, routeName, params, navKey]);

  return (
    <Drawer.Item
      label={label}
      icon={icon}
      active={focused}
      onPress={onTap}
      accessibilityLabel={label}
    />
  );
});

DrawerItem.displayName = 'DrawerItem';

export default DrawerItem;
