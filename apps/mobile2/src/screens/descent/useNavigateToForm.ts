import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Screens } from '../../core/navigation';
import type { DescentDetailsFragment } from './descentDetails.generated';
import type { DescentScreenProps } from './navigation-types';

export default function useNavigateToForm() {
  const navigation = useNavigation<DescentScreenProps['navigation']>();

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
