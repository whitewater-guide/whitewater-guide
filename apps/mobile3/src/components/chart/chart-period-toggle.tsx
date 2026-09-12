import { MenuView, type NativeActionEvent } from '@expo/ui/community/menu';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ChartRow } from './chart-row';
import { useChart } from './chart-provider';
import { useDailyChart } from './use-daily-chart';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const DAYS = [1, 3, 7, 31] as const;

function getI18nSuffix(days: number): string {
  if (days > 10) return 'month';
  if (days > 3) return 'week';
  if (days === 3) return '3days';
  return 'day';
}

export function ChartPeriodToggle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { measurements, filter, onChangeFilter } = useChart();
  const { days, onChangeDays } = useDailyChart(filter, onChangeFilter);

  const onPressAction = useCallback(
    ({ nativeEvent }: NativeActionEvent) => {
      const next = Number(nativeEvent.event);
      if (DAYS.includes(next as (typeof DAYS)[number])) {
        onChangeDays(next);
      }
    },
    [onChangeDays],
  );

  if (measurements.loading) {
    return <ChartRow />;
  }

  return (
    <ChartRow>
      <View style={styles.title}>
        <ThemedText type="smallBold">
          {t('section:chart.periodToggle.title')}
        </ThemedText>
      </View>
      <View style={styles.right}>
        <MenuView
          title={t('section:chart.periodToggle.title')}
          actions={[
            { id: '1', title: t('section:chart.periodToggle.day') },
            { id: '3', title: t('section:chart.periodToggle.3days') },
            { id: '7', title: t('section:chart.periodToggle.week') },
            { id: '31', title: t('section:chart.periodToggle.month') },
          ]}
          onPressAction={onPressAction}
        >
          <ThemedText
            type="small"
            style={[styles.link, { color: theme.primary }]}
          >
            {t(`section:chart.periodToggle.${getI18nSuffix(days)}`)}
          </ThemedText>
        </MenuView>
      </View>
    </ChartRow>
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
});
