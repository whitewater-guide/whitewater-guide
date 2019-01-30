import capitalize from 'lodash/capitalize';
import Toggle from 'material-ui/Toggle';
import * as React from 'react';
import { FlowToggleProps } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/commons';

const styles = {
  container: {
    width: 200,
  },
};

class ChartFlowToggle extends React.PureComponent<FlowToggleProps> {
  onChange = (event: any, isFlow: boolean) =>
    this.props.onChange(isFlow ? Unit.FLOW : Unit.LEVEL);

  render() {
    const { enabled, unit } = this.props;
    return (
      <div style={styles.container}>
        <Toggle
          disabled={!enabled}
          toggled={unit === Unit.FLOW}
          label={capitalize(unit)}
          onToggle={this.onChange}
        />
      </div>
    );
  }
}

export default ChartFlowToggle;
