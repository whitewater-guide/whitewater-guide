import { MenuView } from '@expo/ui/community/menu';
import { Unit } from '@whitewater-guide/schema';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ChartRow } from './chart-row';
import { useChart } from './chart-provider';
import { differenceInDays, formatDistanceToNow } from './date';
import { useGaugeMenu } from './use-gauge-menu';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

function upperFirst(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function GaugeInfo() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { unit, gauge } = useChart();
  const { name, latestMeasurement } = gauge;
  const onPressAction = useGaugeMenu(gauge);

  const isOutdated = latestMeasurement
    ? differenceInDays(new Date(), new Date(latestMeasurement.timestamp)) > 1
    : false;

  const fromNow = latestMeasurement
    ? formatDistanceToNow(new Date(latestMeasurement.timestamp), {
        addSuffix: true,
      })
    : '';

  const label = unit === Unit.FLOW ? t('commons:gauge') : t('commons:gauge');

  return (
    <>
      <ChartRow>
        <View style={styles.title}>
          <ThemedText type="smallBold">{label}</ThemedText>
        </View>
        <MenuView
          title={t('section:chart.gaugeMenu.title')}
          actions={[
            {
              id: 'about',
              title: t('section:chart.gaugeMenu.aboutSource'),
            },
            { id: 'web', title: t('section:chart.gaugeMenu.webPage') },
          ]}
          onPressAction={onPressAction}
          style={styles.right}
        >
          <ThemedText
            type="small"
            style={[styles.link, { color: theme.primary }]}
            numberOfLines={1}
          >
            {upperFirst(name)}
          </ThemedText>
        </MenuView>
      </ChartRow>

      <ChartRow>
        <View style={styles.title}>
          <ThemedText type="smallBold">
            {t('section:chart.lastUpdated')}
          </ThemedText>
        </View>
        <View style={styles.right}>
          <ThemedText type="small">{fromNow}</ThemedText>
          {isOutdated && <View style={styles.outdatedDot} />}
        </View>
      </ChartRow>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  link: {
    textDecorationLine: 'underline',
    textAlign: 'right',
    flex: 1,
  },
  outdatedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
  },
});
