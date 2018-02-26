import RaisedButton from 'material-ui/RaisedButton';
import * as React from 'react';
import { PeriodToggleProps } from '../../ww-clients/features/charts';

const styles = {
  button: {
    marginRight: 8,
    width: 120,
    height: 40,
  },
};

class ChartPeriodToggle extends React.PureComponent<PeriodToggleProps> {
  onDay = () => this.props.onChange(1);
  onWeek = () => this.props.onChange(7);
  onMonth = () => this.props.onChange(31);

  render() {
    return (
      <div>
        <RaisedButton label="One day" primary style={styles.button} onTouchTap={this.onDay} />
        <RaisedButton label="One week" primary style={styles.button} onTouchTap={this.onWeek} />
        <RaisedButton label="One month" primary style={styles.button} onTouchTap={this.onMonth} />
      </div>
    );
  }
}

export default ChartPeriodToggle;
