import { useChart } from '@whitewater-guide/clients';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import React, { useCallback } from 'react';

const ChartPeriodToggle: React.FC = () => {
  const {
    days,
    onChangeDays,
    measurements: { loading },
  } = useChart();
  const onChange = useCallback(
    (e: any, i: any, value: number) => onChangeDays(value),
    [onChangeDays],
  );
  return (
    <SelectField
      disabled={loading}
      floatingLabelText="Period"
      value={days}
      onChange={onChange}
    >
      <MenuItem value={1} primaryText="Today" />
      <MenuItem value={7} primaryText="Last week" />
      <MenuItem value={31} primaryText="Last month" />
    </SelectField>
  );
};

ChartPeriodToggle.displayName = 'ChartPeriodToggle';

export default ChartPeriodToggle;
