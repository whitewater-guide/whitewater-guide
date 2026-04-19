import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import type { DescentDetailsFragment } from './descentDetails.generated';

export default function useNavigateToForm() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return useCallback(
    (descent: DescentDetailsFragment, duplicate = false) => {
      if (duplicate) {
        navigation.navigate(Screens.DESCENT_FORM_SECTION, {
          formData: {
            section: descent.section,
            startedAt: new Date().toISOString(),
            public: descent.public,
          },
        });
      } else {
        navigation.navigate(Screens.DESCENT_FORM_SECTION, {
          descentId: descent.id,
        });
      }
    },
    [navigation],
  );
}
