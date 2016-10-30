import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Gauges, removeAllGauges, removeDisabledGauges, enableAll } from '../../../api/gauges';
import { generateSchedule } from '../../../api/sources';
import {autofill} from '../../../api/sources';
import {withRouter} from 'react-router'
import {createContainer} from 'meteor/react-meteor-data';
import withAdmin from '../../hoc/withAdmin';
import {Meteor} from 'meteor/meteor';

class ListGaugesLeft extends Component {
  static propTypes = {
    location: PropTypes.object,
    admin: PropTypes.bool,
    numGauges: PropTypes.number,
    router: PropTypes.object,
    ready: PropTypes.bool,
  };

  render() {
    const {admin, numGauges, location: {query}} = this.props;
    if (!query.sourceId)
      return null;
    return (
      <div style={styles.container}>
        {admin && numGauges == 0 && <FlatButton secondary={true} onTouchTap={this.autofill} label="Autofill" />}
        {admin && <FlatButton secondary={true} onTouchTap={this.addGauge} label="Add gauge"/>}
        {admin && numGauges > 0 && <FlatButton secondary={true} onTouchTap={this.generateSchedule} label="Generate crons"/>}
        {admin && numGauges > 0 && <FlatButton secondary={true} onTouchTap={this.enableAll} label="Enable all"/>}
        {admin && numGauges > 0 && <FlatButton secondary={true} onTouchTap={this.removeAllGauges} label="Remove all" />}
        {admin && numGauges > 0 && <FlatButton secondary={true} onTouchTap={this.removeDisabledGauges} label="Remove disabled"/>}
      </div>
    );
  }

  removeAllGauges = () => {
    removeAllGauges.callPromise({sourceId: this.props.location.query.sourceId})
      .then(() => console.log('All gauges removed'))
      .catch(err => console.log(`Error while trying to remove all gauges for source ${this.props.location.query.sourceId}: ${err}`));
  };

  removeDisabledGauges = () => {
    removeDisabledGauges.callPromise({sourceId: this.props.location.query.sourceId})
      .then(() => console.log('All disabled gauges removed'))
      .catch(err => console.log(`Error while trying to remove all disabled gauges for source ${this.props.location.query.sourceId}: ${err}`));
  };

  autofill = () => {
    autofill.callPromise({sourceId: this.props.location.query.sourceId})
      .then( result => console.log(`Autofill result: ${result}`))
      .catch( error => console.log(`Autofill error: ${error}`));
  };

  addGauge = () => {
    const location = {
      pathname: '/gauges/new',
      query: {
        sourceId: this.props.location.query.sourceId,
      },
    };
    this.props.router.push(location);
  };

  generateSchedule = () => {
    generateSchedule.callPromise({sourceId: this.props.location.query.sourceId})
      .then(() => console.log('Generated'))
      .catch(err => console.log(`Error while trying to generate schedule for source ${this.props.location.query.sourceId}: ${err}`));
  };

  enableAll = () => {
    enableAll.callPromise({sourceId: this.props.location.query.sourceId})
      .then(() => console.log('Enabled all gauges'))
      .catch(err => console.log(`Error while trying to enable all disabled gauges for source ${this.props.location.query.sourceId}: ${err}`));
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
};

const ListGaugesLeftContainer = createContainer((props) => {
  const sourceId = props.location.query.sourceId;
  const gaugesSubscription = Meteor.subscribe('gauges.inSource', sourceId);
  const numGauges = Gauges.find({sourceId: sourceId}).count();
  return {
    ready: gaugesSubscription.ready(),
    numGauges
  };
}, ListGaugesLeft);

export default withAdmin(withRouter(ListGaugesLeftContainer));