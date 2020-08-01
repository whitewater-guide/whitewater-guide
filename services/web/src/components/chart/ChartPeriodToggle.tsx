import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useChart, useDailyChart } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';

const INPUT_PROS = {
  name: 'period',
  id: 'chart-period-toggle',
};

const ChartPeriodToggle: React.FC = () => {
  const {
    filter,
    onChangeFilter,
    measurements: { loading },
  } = useChart();
  const { days, onChangeDays } = useDailyChart(filter, onChangeFilter);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      onChangeDays(Number(e.target.value)),
    [onChangeDays],
  );
  return (
    <FormControl disabled={loading}>
      <InputLabel htmlFor="chart-period-toggle">Period</InputLabel>
      <Select value={days} onChange={onChange} inputProps={INPUT_PROS}>
        <MenuItem value={1}>Today</MenuItem>
        <MenuItem value={7}>Last week</MenuItem>
        <MenuItem value={31}>Last month</MenuItem>
      </Select>
    </FormControl>
  );
};

ChartPeriodToggle.displayName = 'ChartPeriodToggle';

export default ChartPeriodToggle;
