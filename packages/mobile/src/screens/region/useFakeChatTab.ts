import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { MaterialBottomTabNavigationEventMap } from '@react-navigation/material-bottom-tabs/lib/typescript/src/types';
import {
  CompositeNavigationProp,
  RouteProp,
  ScreenListeners,
} from '@react-navigation/native';
import { useAuth } from '@whitewater-guide/clients';
import { useCallback } from 'react';

import { Screens } from '~/core/navigation';
import {
  RegionTabsNavProp,
  RegionTabsParamsList,
} from '~/screens/region/types';

type RegionChatNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<
    RegionTabsParamsList,
    Screens.REGION_FAKE_CHAT
  >,
  RegionTabsNavProp
>;

interface RegionChatNavProps {
  navigation: RegionChatNavProp;
  route: RouteProp<RegionTabsParamsList, Screens.REGION_FAKE_CHAT>;
}

export default function useFakeChatTab() {
  const { me } = useAuth();

  return useCallback(
    ({
      navigation,
      route,
    }: RegionChatNavProps): ScreenListeners<
      any,
      MaterialBottomTabNavigationEventMap
    > => ({
      tabPress: (e) => {
        e.preventDefault();
        if (!me) {
          navigation.navigate(Screens.AUTH_STACK);
        } else if (route.params?.regionId) {
          navigation.navigate(Screens.CHAT, {
            roomId: route.params.regionId,
            roomType: 'Region',
          });
        }
      },
    }),
    [me],
  );
}
