import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ChartContainer from './ChartContainer';

class InteractiveChart extends Component {

  static propTypes = {
    gaugeId: PropTypes.string.isRequired,
  };

  state = {
    days: 1,
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.buttonContainer}>
          <RaisedButton label="One day" onTouchTap={() => this.setState({days: 1})}/>
          <RaisedButton label="One week" onTouchTap={() => this.setState({days: 7})}/>
          <RaisedButton label="One month" onTouchTap={() => this.setState({days: 31})}/>
        </div>
        <ChartContainer gaugeId={this.props.gaugeId} days={this.state.days}/>
      </div>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
};

export default InteractiveChart;