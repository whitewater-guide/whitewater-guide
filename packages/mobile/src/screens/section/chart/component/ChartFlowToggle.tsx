import { useActionSheet } from '@expo/react-native-action-sheet';
import { useChart, useFormulas } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/commons';
import isNil from 'lodash/isNil';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph, Subheading } from 'react-native-paper';

import Icon from '~/components/Icon';
import { Left, Right, Row } from '~/components/Row';

import ChartFlowToggleUnit from './ChartFlowToggleUnit';

export const ChartFlowToggle: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { unit, onChangeUnit, unitChangeable, gauge, section } = useChart();
  const { latestMeasurement, flowUnit, levelUnit } = gauge;
  const formulas = useFormulas(section);

  const { showActionSheetWithOptions } = useActionSheet();
  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('section:chart.flowToggle'),
        options: [t('commons:flow'), t('commons:level'), t('commons:cancel')],
        cancelButtonIndex: 2,
      },
      (index: number) => {
        if (index < 2) {
          onChangeUnit(index ? Unit.LEVEL : Unit.FLOW);
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
      <Left row={true}>
        <Subheading>{`${t('section:chart.lastRecorded.title')} `}</Subheading>
        <ChartFlowToggleUnit unit={unit} />
      </Left>
      <Right row={true}>
        <Paragraph>{`${value} ${t('commons:' + unitName)}`}</Paragraph>
        {unitChangeable && (
          <Icon primary={true} icon="dots-vertical" onPress={showMenu} />
        )}
      </Right>
    </Row>
  );
});

ChartFlowToggle.displayName = 'ChartFlowToggle';
