import { useChart } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/commons';
import capitalize from 'lodash/capitalize';
import Toggle from 'material-ui/Toggle';
import React, { useCallback } from 'react';

const styles = {
  container: {
    width: 200,
  },
};

const ChartFlowToggle: React.FC = () => {
  const { unit, onChangeUnit, unitChangeable } = useChart();
  const onToggle = useCallback(
    (_: any, isFlow: boolean) => onChangeUnit(isFlow ? Unit.FLOW : Unit.LEVEL),
    [onChangeUnit],
  );
  return (
    <div style={styles.container}>
      <Toggle
        disabled={!unitChangeable}
        toggled={unit === Unit.FLOW}
        label={capitalize(unit)}
        onToggle={onToggle}
      />
    </div>
  );
};

ChartFlowToggle.displayName = 'ChartFlowToggle';

export default ChartFlowToggle;
