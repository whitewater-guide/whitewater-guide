import type { LinkingOptions } from '@react-navigation/native';
import { useMemo } from 'react';
import Config from 'react-native-config';

import type { RootDrawerParamsList } from './navigation-params';
import { Screens } from './screen-names';

export default function useLinking(): LinkingOptions<RootDrawerParamsList> {
  return useMemo(
    () => ({
      prefixes: [
        `${Config.BACKEND_PROTOCOL}://${Config.DEEP_LINKING_DOMAIN}`,
        `${Config.BACKEND_PROTOCOL}://whitewater.guide`,
      ],
      config: {
        screens: {
          [Screens.ROOT_STACK]: {
            screens: {
              [Screens.AUTH_STACK]: {
                screens: {
                  [Screens.AUTH_RESET]: 'auth/reset/:token',
                },
              },
              [Screens.CONNECT_EMAIL]: 'auth/verify-email/:token',
              [Screens.REGION_STACK]: 'region/:regionId',
              [Screens.SECTION_SCREEN]: 'section/:sectionId',
            },
          },
        },
      },
    }),
    [],
  );
}
