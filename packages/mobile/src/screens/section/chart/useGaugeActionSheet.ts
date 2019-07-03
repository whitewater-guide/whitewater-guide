import { Gauge } from '@whitewater-guide/commons';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import { MutableRefObject, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import ActionSheet, { ActionSheetProps } from 'react-native-actionsheet';
import { useActionSheet } from '../../../components';
import Screens from '../../screen-names';

type UseGaugeSheet = [
  MutableRefObject<ActionSheet | null>,
  () => void,
  Pick<ActionSheetProps, 'onPress' | 'options'>,
];

const useGaugeActionSheet = (gauge: Gauge): UseGaugeSheet => {
  const [actionSheet, showActionSheet] = useActionSheet();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const options = useMemo(
    () => [
      t('section:chart.gaugeMenu.aboutSource'),
      t('section:chart.gaugeMenu.webPage'),
      t('commons:cancel'),
    ],
    [t],
  );
  const onPress = useCallback(
    (index: number) => {
      if (index === 1) {
        if (gauge.url) {
          Linking.openURL(gauge.url).catch(() => {});
        }
      } else if (index === 0) {
        navigate({
          routeName: Screens.Plain,
          params: {
            title: t('section:chart.gaugeMenu.aboutSource'),
            text: gauge.source.termsOfUse,
          },
        });
      }
    },
    [gauge, navigate, t],
  );
  return [actionSheet, showActionSheet, { options, onPress }];
};

export default useGaugeActionSheet;
