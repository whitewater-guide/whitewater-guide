import { NavigationState, useNavigation } from '@react-navigation/native';
import { nanoid } from 'nanoid/non-secure';
import { useCallback } from 'react';

import { RootStackNav, Screens } from '~/core/navigation';
import { RootStackParamsList } from '~/core/navigation/navigation-params';

import { DescentDetailsFragment } from './descentDetails.generated';

const replaceDetailsWithForm = (
  state: NavigationState,
  params: RootStackParamsList[Screens.DESCENT_FORM],
): NavigationState => {
  const routes = [...state.routes];
  routes.pop();
  routes.push({
    name: Screens.DESCENT_FORM,
    key: `descent_form_${nanoid()}`,
    params,
    state: {
      index: 1,
      routes: [
        {
          name: Screens.DESCENT_FORM_SECTION,
          key: `descent_form_section_${nanoid()}`,
        },
        {
          name: Screens.DESCENT_FORM_DATE,
          key: `descent_form_date_${nanoid()}`,
        },
      ],
    },
  });
  return { ...state, routes };
};

export default () => {
  const { reset, dangerouslyGetState } = useNavigation<RootStackNav>();
  return useCallback(
    (descent: DescentDetailsFragment, duplicate = false) => {
      const params: RootStackParamsList[Screens.DESCENT_FORM] = duplicate
        ? {
            formData: {
              section: descent.section,
              startedAt: new Date().toISOString(),
              public: descent.public,
            },
          }
        : {
            descentId: descent.id,
          };
      const parentState = dangerouslyGetState();
      if (parentState) {
        reset(replaceDetailsWithForm(parentState, params) as any);
      }
    },
    [reset, dangerouslyGetState],
  );
};
