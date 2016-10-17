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
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
    admin: PropTypes.bool,
    numGauges: PropTypes.number,
    router: PropTypes.object,
    ready: PropTypes.bool,
  };

  render() {
    const {admin, numGauges} = this.props; 
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
    removeAllGauges.callPromise({sourceId: this.props.params.sourceId})
      .then(() => console.log('All gauges removed'))
      .catch(err => console.log(`Error while trying to remove all gauges for source ${this.props.source._id}: ${err}`));
  };

  removeDisabledGauges = () => {
    removeDisabledGauges.callPromise({sourceId: this.props.params.sourceId})
      .then(() => console.log('All disabled gauges removed'))
      .catch(err => console.log(`Error while trying to remove all disabled gauges for source ${this.props.source._id}: ${err}`));
  };

  autofill = () => {
    autofill.callPromise({sourceId: this.props.params.sourceId})
      .then( result => console.log(`Autofill result: ${result}`))
      .catch( error => console.log(`Autofill error: ${error}`));
  };

  addGauge = () => {
    this.props.router.push(`/sources/${this.props.params.sourceId}/gauges/new`);
  };

  generateSchedule = () => {
    generateSchedule.callPromise({sourceId: this.props.params.sourceId})
      .then(() => console.log('Generated'))
      .catch(err => console.log(`Error while trying to generate schedule for source ${this.props.source._id}: ${err}`));
  };

  enableAll = () => {
    enableAll.callPromise({sourceId: this.props.params.sourceId})
      .then(() => console.log('Enabled all gauges'))
      .catch(err => console.log(`Error while trying to enable all disabled gauges for source ${this.props.source._id}: ${err}`));
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },

}

const ListGaugesLeftContainer = createContainer((props) => {
  const gaugesSubscription = Meteor.subscribe('gauges.inSource', props.sourceId);
  const numGauges = Gauges.find({sourceId: props.sourceId}).count();
  return {
    ready: gaugesSubscription.ready(),
    numGauges
  };
}, ListGaugesLeft);

export default withAdmin(withRouter(ListGaugesLeftContainer));