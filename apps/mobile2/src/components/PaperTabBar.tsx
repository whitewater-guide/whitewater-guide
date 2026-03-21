import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { BottomNavigation } from 'react-native-paper';

import theme from '../theme';

function PaperTabBar({
  navigation,
  state,
  descriptors,
  insets,
}: BottomTabBarProps) {
  return (
    <BottomNavigation.Bar
      navigationState={state}
      safeAreaInsets={insets}
      shifting
      activeColor={theme.colors.textLight}
      inactiveColor={theme.colors.primaryLighter}
      activeIndicatorStyle={{ opacity: 0 }}
      style={{ backgroundColor: theme.colors.primary }}
      keyboardHidesNavigationBar={false}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) =>
        descriptors[route.key].options.tabBarIcon?.({
          focused,
          color,
          size: 24,
        }) || null
      }
      getLabelText={({ route }) => {
        const label = descriptors[route.key].options.tabBarLabel;
        return typeof label === 'string' ? label : route.name;
      }}
      getTestID={({ route }) =>
        descriptors[route.key].options.tabBarButtonTestID
      }
    />
  );
}

export default PaperTabBar;
