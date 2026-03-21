import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import type {
  GaugeCoreFragment,
  GaugeSourceFragment,
} from '@whitewater-guide/schema';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { Screens } from '~/core/navigation';

import type { SectionChartNavProp } from './types';

const useGaugeActionSheet = (
  gauge: GaugeCoreFragment & GaugeSourceFragment,
) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation();
  const { navigate } = useNavigation<SectionChartNavProp>();

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
      (index: number) => {
        if (index === 1) {
          if (gauge.url) {
            Linking.openURL(gauge.url).catch(() => {
              // do not care if cannot open it
            });
          }
        } else if (index === 0) {
          navigate(Screens.PLAIN, {
            title: t('screens:section.chart.gaugeMenu.aboutSource'),
            text: gauge.source.termsOfUse,
          });
        }
      },
    );
  }, [showActionSheetWithOptions, t, gauge, navigate]);
};

export default useGaugeActionSheet;
