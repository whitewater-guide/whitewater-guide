import { useActionSheet } from '@expo/react-native-action-sheet';
import { useChart, useFormulas } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';
import isNil from 'lodash/isNil';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import Icon from '../Icon';
import { Row } from '../Row';
import ChartFlowToggleUnit from './ChartFlowToggleUnit';

const styles = StyleSheet.create({
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

/**
 * Row showing the last-recorded value in the current unit, with an optional
 * 3-dot menu to switch between flow and level units.
 */
export function ChartFlowToggle() {
  const { t } = useTranslation();
  const { unit, onChangeUnit, unitChangeable, gauge, section } = useChart();
  const { latestMeasurement, flowUnit, levelUnit } = gauge;
  const formulas = useFormulas(section);
  const { showActionSheetWithOptions } = useActionSheet();

  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('screens:section.chart.flowToggle'),
        options: [t('commons:flow'), t('commons:level'), t('commons:cancel')],
        cancelButtonIndex: 2,
      },
      (index?: number) => {
        if (index != null && index < 2) {
          onChangeUnit(index === 0 ? Unit.FLOW : Unit.LEVEL);
        }
      },
    );
  }, [showActionSheetWithOptions, t, onChangeUnit]);

  let value = '?';
  if (latestMeasurement) {
    const numeric =
      unit === Unit.FLOW
        ? formulas.flows(latestMeasurement.flow)
        : formulas.levels(latestMeasurement.level);
    value = isNil(numeric) ? '' : numeric.toFixed(2);
  }
  const unitName = unit === Unit.FLOW ? flowUnit : levelUnit;

  return (
    <Row>
      <View style={styles.left}>
        <Text variant="titleMedium">
          {`${t('screens:section.chart.lastRecorded.title')} `}
        </Text>
        <ChartFlowToggleUnit unit={unit} />
      </View>
      <View style={styles.right}>
        <Text variant="bodyMedium">{`${value} ${t(`commons:${unitName}`)}`}</Text>
        {unitChangeable && (
          <Icon primary icon="dots-vertical" onPress={showMenu} />
        )}
      </View>
    </Row>
  );
}
