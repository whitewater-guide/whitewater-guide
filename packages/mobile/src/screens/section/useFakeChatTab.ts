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

import { SectionScreenNavProp, SectionTabsParamsList } from './types';

type SectionChatNavProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<
    SectionTabsParamsList,
    Screens.SECTION_FAKE_CHAT
  >,
  SectionScreenNavProp
>;

interface SectionChatNavProps {
  navigation: SectionChatNavProp;
  route: RouteProp<SectionTabsParamsList, Screens.SECTION_FAKE_CHAT>;
}

export default function useFakeChatTab(room?: Room | null) {
  const { me } = useAuth();

  return useCallback(
    ({
      navigation,
    }: SectionChatNavProps): ScreenListeners<
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
