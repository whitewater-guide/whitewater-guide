import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { type RootStackParamsList, Screens } from '../../core/navigation';

interface GaugeArg {
  url?: string | null;
  source: { termsOfUse?: string | null };
}

export function useGaugeActionSheet(gauge: GaugeArg) {
  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('screens:section.chart.gaugeMenu.title'),
        options: [
          t('screens:section.chart.gaugeMenu.aboutSource'),
          t('screens:section.chart.gaugeMenu.webPage'),
          t('commons:cancel'),
        ],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) {
          navigation.navigate(Screens.PLAIN, {
            title: t('screens:section.chart.gaugeMenu.aboutSource'),
            text: gauge.source.termsOfUse,
          });
        } else if (index === 1 && gauge.url) {
          Linking.openURL(gauge.url).catch(() => {});
        }
      },
    );
  }, [showActionSheetWithOptions, t, gauge, navigation]);
}
