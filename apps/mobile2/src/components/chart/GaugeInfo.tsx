import { formatDistanceToNow, useChart } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';
import differenceInDays from 'date-fns/differenceInDays';
import parseISO from 'date-fns/parseISO';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import theme from '../../theme';
import { Row } from '../Row';
import { useGaugeActionSheet } from './useGaugeActionSheet';

const styles = StyleSheet.create({
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'right',
    flex: 1,
  },
  outdatedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  },
});

/**
 * Two rows showing gauge metadata:
 * 1. Gauge name (tappable to show the gauge URL or action sheet — link only)
 * 2. Last update time with an error indicator when data is >1 day old.
 */
export function GaugeInfo() {
  const { t } = useTranslation();
  const { unit, gauge } = useChart();
  const { name, latestMeasurement } = gauge;
  const showMenu = useGaugeActionSheet(gauge);

  const isOutdated = latestMeasurement
    ? differenceInDays(new Date(), parseISO(latestMeasurement.timestamp)) > 1
    : false;

  const fromNow = latestMeasurement
    ? formatDistanceToNow(parseISO(latestMeasurement.timestamp), {
        addSuffix: true,
      })
    : '';

  const label = unit === Unit.FLOW ? t('commons:gauge') : t('commons:gauge');

  return (
    <>
      <Row>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium">{label}</Text>
        </View>
        <Pressable onPress={showMenu} style={styles.right} hitSlop={8}>
          <Text variant="bodyMedium" style={styles.link} numberOfLines={1}>
            {upperFirst(name)}
          </Text>
        </Pressable>
      </Row>

      <Row>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium">
            {t('screens:section.chart.lastUpdated')}
          </Text>
        </View>
        <View style={styles.right}>
          <Text variant="bodyMedium">{fromNow}</Text>
          {isOutdated && <View style={styles.outdatedDot} />}
        </View>
      </Row>
    </>
  );
}
