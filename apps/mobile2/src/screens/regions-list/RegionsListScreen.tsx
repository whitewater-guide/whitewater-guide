import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Screen from '../../components/Screen';
import type { RegionsListScreenProps } from './navigation-types';
import RegionsListView from './RegionsListView';

function RegionsListScreen({ navigation }: RegionsListScreenProps) {
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ headerTitle: t('regionsList:title') });
    }, [navigation, t]),
  );

  // Enable drawer swipe only on this screen
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
}

export default RegionsListScreen;
