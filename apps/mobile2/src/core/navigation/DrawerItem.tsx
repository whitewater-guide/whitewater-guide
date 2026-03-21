import { memo, useCallback } from 'react';
import { Drawer } from 'react-native-paper';

interface DrawerItemProps {
  label: string;
  routeName: string;
  icon?: string;
  params?: Record<string, unknown>;
  testID: string;
  onPress: (routeName: string, params?: Record<string, unknown>) => void;
}

const DrawerItem = memo(
  ({ label, routeName, icon, params, testID, onPress }: DrawerItemProps) => {
    const onTap = useCallback(() => {
      onPress(routeName, params);
    }, [onPress, routeName, params]);

    return (
      <Drawer.Item
        label={label}
        icon={icon}
        onPress={onTap}
        accessibilityLabel={label}
        testID={testID}
      />
    );
  },
);

DrawerItem.displayName = 'DrawerItem';

export default DrawerItem;
