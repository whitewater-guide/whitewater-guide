import capitalize from 'lodash/capitalize';
import Toggle from 'material-ui/Toggle';
import * as React from 'react';
import { FlowToggleProps } from '../../ww-clients/features/charts';
import { Unit } from '../../ww-commons';

const styles = {
  toggle: {
    marginBottom: 16,
  },
};

class ChartFlowToggle extends React.PureComponent<FlowToggleProps> {
  onChange = (event: any, isFlow: boolean) => this.props.onChange(isFlow ? Unit.FLOW : Unit.LEVEL);

  render() {
    const { enabled, unit } = this.props;
    if (!enabled) {
      return null;
    }
    return (
      <Toggle
        toggled={unit === Unit.FLOW}
        label={capitalize(unit)}
        style={styles.toggle}
        onToggle={this.onChange}
      />
    );
  }
}

export default ChartFlowToggle;
