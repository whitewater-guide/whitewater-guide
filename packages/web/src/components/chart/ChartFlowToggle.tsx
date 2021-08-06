import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useChart } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';
import capitalize from 'lodash/capitalize';
import React, { ChangeEvent, useCallback } from 'react';

const styles = {
  container: {
    width: 200,
  },
};

const ChartFlowToggle: React.FC = () => {
  const { unit, onChangeUnit, unitChangeable } = useChart();
  const onToggle = useCallback(
    (_: ChangeEvent, isFlow: boolean) =>
      onChangeUnit(isFlow ? Unit.FLOW : Unit.LEVEL),
    [onChangeUnit],
  );
  return (
    <div style={styles.container}>
      <FormControlLabel
        control={<Switch checked={unit === Unit.FLOW} onChange={onToggle} />}
        label={capitalize(unit)}
        disabled={!unitChangeable}
      />
    </div>
  );
};

ChartFlowToggle.displayName = 'ChartFlowToggle';

export default ChartFlowToggle;
