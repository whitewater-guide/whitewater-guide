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

const DAYS = [1, 3, 7, 31];

function getI18nSuffix(days: number) {
  if (days > 10) {
    return 'month';
  }
  if (days > 3) {
    return 'week';
  }
  if (days === 3) {
    return '3days';
  }
  return 'day';
}

export const ChartPeriodToggle: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { measurements, filter, onChangeFilter } = useChart();
  const { days, onChangeDays } = useDailyChart(filter, onChangeFilter);

  const { showActionSheetWithOptions } = useActionSheet();
  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('screens:section.chart.periodToggle.title'),
        options: [
          t('screens:section.chart.periodToggle.day'),
          t('screens:section.chart.periodToggle.3days'),
          t('screens:section.chart.periodToggle.week'),
          t('screens:section.chart.periodToggle.month'),
          t('commons:cancel'),
        ],
        cancelButtonIndex: DAYS.length,
      },
      (i: number) => {
        if (i < DAYS.length) {
          onChangeDays(DAYS[i]);
        }
      },
    );
  }, [showActionSheetWithOptions, t, onChangeDays]);

  if (measurements.loading) {
    return <Row />;
  }
  return (
    <Row>
      <Left row>
        <Subheading>{t('screens:section.chart.periodToggle.title')}</Subheading>
      </Left>
      <Right row>
        <Paragraph style={styles.link} onPress={showMenu}>
          {t(`screens:section.chart.periodToggle.${getI18nSuffix(days)}`)}
        </Paragraph>
      </Right>
    </Row>
  );
});

ChartPeriodToggle.displayName = 'ChartPeriodToggle';
