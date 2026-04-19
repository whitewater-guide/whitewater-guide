import { useChart } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Switch } from 'react-native-paper';

import theme from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.margin.single,
    paddingHorizontal: theme.margin.single,
  },
});

function DescentChartFlowToggle() {
  const { unit, onChangeUnit, unitChangeable, gauge } = useChart();
  const { t } = useTranslation();
  const unitName = unit === Unit.FLOW ? gauge.flowUnit : gauge.levelUnit;

  const onValueChange = useCallback(
    (value: boolean) => {
      onChangeUnit(value ? Unit.FLOW : Unit.LEVEL);
    },
    [onChangeUnit],
  );

  if (!unitChangeable) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Paragraph>
        {t(`commons:${unit}`)}
        {unitName ? ` (${unitName})` : ''}
      </Paragraph>
      <Switch value={unit === Unit.FLOW} onValueChange={onValueChange} />
    </View>
  );
}

export default DescentChartFlowToggle;
