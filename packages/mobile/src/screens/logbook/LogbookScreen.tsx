import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getHeaderRenderer } from '~/components/header';
import { Screen } from '~/components/Screen';

import LogbookView from './LogbookView';
import type { LogbookNavProps } from './types';

const LogbookScreen: React.FC<LogbookNavProps> = (props) => {
  const { navigation } = props;

  const { t } = useTranslation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('screens:logbook.headerTitle'),
      header: getHeaderRenderer(true),
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
      <LogbookView {...props} />
    </Screen>
  );
};

export default LogbookScreen;
