import { useChart, useFormulas } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/commons';
import isNil from 'lodash/isNil';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ActionSheet from 'react-native-actionsheet';
import { Paragraph, Subheading } from 'react-native-paper';
import Icon from '../Icon';
import { Left, Right, Row } from '../Row';
import useActionSheet from '../useActionSheet';
import ChartFlowToggleUnit from './ChartFlowToggleUnit';

export const ChartFlowToggle: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { unit, onChangeUnit, unitChangeable, gauge, section } = useChart();
  const { latestMeasurement, flowUnit, levelUnit } = gauge;
  const formulas = useFormulas(section);
  const options = useMemo(
    () => [t('commons:flow'), t('commons:level'), t('commons:cancel')],
    [t],
  );
  const [actionSheet, showActionSheet] = useActionSheet();
  const onSelect = useCallback(
    (index: number) => {
      if (index < 2) {
        onChangeUnit(index ? Unit.LEVEL : Unit.FLOW);
      }
    },
    [onChangeUnit],
  );
  let value: string = '?';
  if (latestMeasurement) {
    const numeric =
      unit === Unit.FLOW
        ? formulas.flows(latestMeasurement.flow)
        : formulas.levels(latestMeasurement.level);
    value = isNil(numeric) ? '' : numeric.toFixed(2);
  }
  const unitName = unit === Unit.FLOW ? flowUnit! : levelUnit!;
  return (
    <Row>
      <Left row={true}>
        <Subheading>{`${t('section:chart.lastRecorded.title')} `}</Subheading>
        <ChartFlowToggleUnit unit={unit} />
      </Left>
      <Right row={true}>
        <Paragraph>{`${value} ${t('commons:' + unitName)}`}</Paragraph>
        {unitChangeable && (
          <Icon primary={true} icon="dots-vertical" onPress={showActionSheet} />
        )}
        {unitChangeable && (
          <ActionSheet
            ref={actionSheet}
            title={t('section:chart.flowToggle')}
            options={options}
            cancelButtonIndex={2}
            onPress={onSelect}
          />
        )}
      </Right>
    </Row>
  );
});

ChartFlowToggle.displayName = 'ChartFlowToggle';
