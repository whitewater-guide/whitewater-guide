import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Chart from './Chart';
import moment from 'moment';
import _ from 'lodash';

export class InteractiveChart extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    onDomainChanged: PropTypes.func,
    startDate: PropTypes.instanceOf(Date),//initital value
    endDate: PropTypes.instanceOf(Date),//initital value
  };

  constructor(props){
    super(props);
    this.state = {
      //This is what is selected on chart, available data can contain more measurements
      chartDomain: [props.startDate, props.endDate],
      unit: 'flow',
    };
  }

  render() {
    let {data} = this.props;
    const {chartDomain} = this.state;
    const start = moment(chartDomain[0]);
    const end = moment(chartDomain[1]);
    //Filter data so chart doesn't draw anything beyond selection
    data = _.filter(data, ({date}) => start.isBefore(date) && end.isAfter(date));
    return (
      <div style={styles.container}>
        <div style={styles.buttonContainer}>
          <RaisedButton label="One day"   primary={true} style={styles.button} onTouchTap={() => this.setDomainInDays(1)}/>
          <RaisedButton label="One week"  primary={true} style={styles.button} onTouchTap={() => this.setDomainInDays(7)}/>
          <RaisedButton label="One month" primary={true} style={styles.button} onTouchTap={() => this.setDomainInDays(31)}/>
          <SelectField
            value={this.state.unit}
            onChange={(event, index, unit) => this.setState({unit})}
          >
            <MenuItem value={"level"} primaryText="Level" />
            <MenuItem value={"flow"} primaryText="Flow" />
          </SelectField>
        </div>
        <Chart data={data} unit={this.state.unit} domain={chartDomain} onDomainChanged={this.onDomainChanged}/>
      </div>
    );
  }

  setDomainInDays = (days) => {
    let domain = [moment().subtract(days, 'days').toDate(), new Date()];
    this.setState({chartDomain: domain});
    //Ask parent to give us new data (or maybe same, if new domain is more narrow than existing data)
    this.props.onDomainChanged(domain);
  };

  onDomainChanged = ({x: domain}) => {
    this.setState({chartDomain: domain});
    //Ask parent to give us new data (or maybe same, if new domain is more narrow than existing data)
    this.props.onDomainChanged(domain);
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginRight: 8,
    width: 120,
    height: 40,
  },
};
