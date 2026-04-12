import { useActionSheet } from '@expo/react-native-action-sheet';
import { useChart, useDailyChart } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Row } from '../Row';
import theme from '../../theme';

const styles = StyleSheet.create({
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

const DAYS = [1, 3, 7, 31] as const;

function getI18nSuffix(days: number): string {
  if (days > 10) return 'month';
  if (days > 3) return 'week';
  if (days === 3) return '3days';
  return 'day';
}

/**
 * Row showing the current time period with a tappable link to change it.
 */
export function ChartPeriodToggle() {
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
      (index?: number) => {
        if (index != null && index < DAYS.length) {
          onChangeDays(DAYS[index]);
        }
      },
    );
  }, [showActionSheetWithOptions, t, onChangeDays]);

  if (measurements.loading) {
    return <Row />;
  }

  return (
    <Row>
      <View style={{ flex: 1 }}>
        <Text variant="titleMedium">
          {t('screens:section.chart.periodToggle.title')}
        </Text>
      </View>
      <View style={styles.right}>
        <Pressable onPress={showMenu}>
          <Text variant="bodyMedium" style={styles.link}>
            {t(
              `screens:section.chart.periodToggle.${getI18nSuffix(days)}`,
            )}
          </Text>
        </Pressable>
      </View>
    </Row>
  );
}
