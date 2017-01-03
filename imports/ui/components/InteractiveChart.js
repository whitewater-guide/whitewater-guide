import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ChartContainer from './ChartContainer';
import moment from 'moment';

class InteractiveChart extends Component {

  static propTypes = {
    gaugeId: PropTypes.string.isRequired,
  };

  state = {
    chartDomain: [moment().subtract(1, 'days').toDate(), new Date()],
    subDomain: [moment().subtract(1, 'days').toDate(), new Date()],
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.buttonContainer}>
          <RaisedButton label="One day" onTouchTap={() => this.setDomainInDays(1)}/>
          <RaisedButton label="One week" onTouchTap={() => this.setDomainInDays(7)}/>
          <RaisedButton label="One month" onTouchTap={() => this.setDomainInDays(31)}/>
        </div>
        <ChartContainer
          gaugeId={this.props.gaugeId}
          chartDomain={this.state.chartDomain}
          subDomain={this.state.subDomain}
          onDomainChange={this.onDomainChange}
        />
      </div>
    );
  }

  setDomainInDays = (days) => {
    let domain = [moment().subtract(days, 'days').toDate(), new Date()];
    let chartRange = moment.range(domain);
    let subRange = moment.range(this.state.subDomain);
    subRange = subRange.add(chartRange);
    this.setState({chartDomain: domain, subDomain: subRange.toDate()});
  };

  onDomainChange = ({x: domain}) => {
    let chartRange = moment.range(domain);
    let subRange = moment.range(this.state.subDomain);
    subRange = subRange.add(chartRange);
    this.setState({chartDomain: domain, subDomain: subRange.toDate()});
  };
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