import React, { useCallback, useEffect } from 'react';
import {
  RegionsSearchStringContext,
  RegionsSearchStringSetterContext,
} from '@whitewater-guide/clients';

import { RegionsListNavProps } from './types';
import RegionsListView from './RegionsListView';
import { Screen } from '~/components/Screen';
import { getHeaderRenderer } from '~/components/header';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export const RegionsListScreen: React.FC<RegionsListNavProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('regionsList:title'),
      header: getHeaderRenderer(
        true,
        [RegionsSearchStringContext, RegionsSearchStringSetterContext],
        'regionsList:regionSearchPlaceholder',
      ),
    });
  }, [t, navigation]);

  // This enables drawer gestures only on this screen
  useFocusEffect(
    useCallback(() => {
      navigation.dangerouslyGetParent()?.setOptions({ gestureEnabled: true });
      return () => {
        navigation
          .dangerouslyGetParent()
          ?.setOptions({ gestureEnabled: false });
      };
    }, [navigation]),
  );

  return (
    <Screen>
      <RegionsListView />
    </Screen>
  );
};
