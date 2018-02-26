import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import * as React from 'react';
import { FlowToggleProps } from '../../ww-clients/features/charts';
import { Unit } from '../../ww-commons';

class ChartFlowToggle extends React.PureComponent<FlowToggleProps> {
  onChange = (event: any, index: number, newMeasurement: Unit) => this.props.onChange(newMeasurement);

  render() {
    const { enabled, measurement } = this.props;
    if (!enabled) {
      return null;
    }
    return (
      <SelectField
        value={measurement}
        onChange={this.onChange}
      >
        <MenuItem value={'level'} primaryText="Level" />
        <MenuItem value={'flow'} primaryText="Flow" />
      </SelectField>
    );
  }
}

export default ChartFlowToggle;
