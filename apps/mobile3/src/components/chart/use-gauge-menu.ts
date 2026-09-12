import type { NativeActionEvent } from '@expo/ui/community/menu';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking } from 'react-native';

import type { GaugeForChart } from './types';

export function useGaugeMenu(gauge: Pick<GaugeForChart, 'url' | 'source'>) {
  const { t } = useTranslation();

  return useCallback(
    ({ nativeEvent }: NativeActionEvent) => {
      if (nativeEvent.event === 'about') {
        Alert.alert(
          t('section:chart.gaugeMenu.aboutSource'),
          gauge.source.termsOfUse ?? '',
        );
      } else if (nativeEvent.event === 'web' && gauge.url) {
        Linking.openURL(gauge.url).catch(() => {});
      }
    },
    [t, gauge],
  );
}
