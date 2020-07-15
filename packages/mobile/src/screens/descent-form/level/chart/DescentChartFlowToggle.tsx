import { useChart } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Switch } from 'react-native-paper';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.margin.single,
  },
});

const DescentChartFlowToggle: React.FC = () => {
  const { unit, onChangeUnit, unitChangeable, gauge } = useChart();
  const { t } = useTranslation();
  const { flowUnit, levelUnit } = gauge;
  const unitName = unit === Unit.FLOW ? flowUnit! : levelUnit!;
  const onValueChange = useCallback(
    (value: boolean) => {
      onChangeUnit(value ? Unit.FLOW : Unit.LEVEL);
    },
    [onChangeUnit],
  );
  return (
    <View style={styles.container}>
      <Paragraph>
        {t(`commons:${unit}`)}
        {` (${unitName})`}
      </Paragraph>
      <Switch
        value={unit === Unit.FLOW}
        onValueChange={onValueChange}
        disabled={!unitChangeable}
      />
    </View>
  );
};

export default DescentChartFlowToggle;
