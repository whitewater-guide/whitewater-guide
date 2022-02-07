import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { MaterialBottomTabNavigationEventMap } from '@react-navigation/material-bottom-tabs/lib/typescript/src/types';
import {
  CompositeNavigationProp,
  RouteProp,
  ScreenListeners,
} from '@react-navigation/native';
import { useAuth } from '@whitewater-guide/clients';
import { Room } from '@whitewater-guide/schema';
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

export default function useFakeChatTab(room?: Room | null) {
  const { me } = useAuth();

  return useCallback(
    ({
      navigation,
    }: RegionChatNavProps): ScreenListeners<
      any,
      MaterialBottomTabNavigationEventMap
    > => ({
      tabPress: (e) => {
        e.preventDefault();
        if (!me) {
          navigation.navigate(Screens.AUTH_STACK);
        } else if (room) {
          navigation.navigate(Screens.CHAT, {
            room,
          });
        }
      },
    }),
    [me, room],
  );
}
