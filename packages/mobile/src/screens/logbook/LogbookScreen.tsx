import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getHeaderRenderer } from '~/components/header';
import { Screen } from '~/components/Screen';
import LogbookView from './LogbookView';
import { LogbookNavProps } from './types';

const LogbookScreen: React.FC<LogbookNavProps> = (props) => {
  const { navigation } = props;

  const { t } = useTranslation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('screens:logbook.headerTitle'),
      header: getHeaderRenderer(true),
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
      <LogbookView {...props} />
    </Screen>
  );
};

export default LogbookScreen;
