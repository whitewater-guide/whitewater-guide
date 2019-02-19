import { PeriodToggleProps } from '@whitewater-guide/clients';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import * as React from 'react';

class ChartPeriodToggle extends React.PureComponent<PeriodToggleProps> {
  onChange = (e: any, i: any, value: number) => this.props.onChange(value);

  render() {
    return (
      <SelectField
        disabled={this.props.loading}
        floatingLabelText="Period"
        value={this.props.days}
        onChange={this.onChange}
      >
        <MenuItem value={1} primaryText="Today" />
        <MenuItem value={7} primaryText="Last week" />
        <MenuItem value={31} primaryText="Last month" />
      </SelectField>
    );
  }
}

export default ChartPeriodToggle;
