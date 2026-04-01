import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Screen from '../../components/Screen';
import type { RootStackParamsList } from '../../core/navigation/navigation-params';
import type { Screens } from '../../core/navigation/screen-names';
import RegionsListView from './RegionsListView';

interface Props {
  navigation: NativeStackNavigationProp<
    RootStackParamsList,
    typeof Screens.REGIONS_LIST
  >;
}

function RegionsListScreen({ navigation }: Props) {
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
