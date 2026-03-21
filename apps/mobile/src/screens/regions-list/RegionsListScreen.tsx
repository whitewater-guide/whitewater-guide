import { useFocusEffect } from '@react-navigation/native';
import {
  RegionsSearchStringContext,
  RegionsSearchStringSetterContext,
} from '@whitewater-guide/clients';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getHeaderRenderer } from '~/components/header';
import { Screen } from '~/components/Screen';

import RegionsListView from './RegionsListView';
import type { RegionsListNavProps } from './types';

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

  // This enables drawer swipe only on this screen
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ swipeEnabled: true });
      return () => {
        navigation.getParent()?.setOptions({ swipeEnabled: false });
      };
    }, [navigation]),
  );

  return (
    <Screen>
      <RegionsListView />
    </Screen>
  );
};
