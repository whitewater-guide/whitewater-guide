import { useActionSheet } from '@expo/react-native-action-sheet';
import { useChart, useDailyChart } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';

import { Left, Right, Row } from '~/components/Row';
import theme from '~/theme';

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

const DAYS = [1, 7, 31];

export const ChartPeriodToggle: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { measurements, filter, onChangeFilter } = useChart();
  const { days, onChangeDays } = useDailyChart(filter, onChangeFilter);

  const { showActionSheetWithOptions } = useActionSheet();
  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('section:chart.periodToggle.title'),
        options: [
          t('section:chart.periodToggle.day'),
          t('section:chart.periodToggle.week'),
          t('section:chart.periodToggle.month'),
          t('commons:cancel'),
        ],
        cancelButtonIndex: 3,
      },
      (i: number) => {
        if (i < 3) {
          onChangeDays(DAYS[i]);
        }
      },
    );
  }, [showActionSheetWithOptions, t, onChangeDays]);

  if (measurements.loading) {
    return <Row />;
  }
  const index = days > 10 ? 'month' : days > 2 ? 'week' : 'day';
  return (
    <Row>
      <Left row>
        <Subheading>{t('section:chart.periodToggle.title')}</Subheading>
      </Left>
      <Right row>
        <Paragraph style={styles.link} onPress={showMenu}>
          {t(`section:chart.periodToggle.${index}`)}
        </Paragraph>
      </Right>
    </Row>
  );
});

ChartPeriodToggle.displayName = 'ChartPeriodToggle';
