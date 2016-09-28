import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Gauges, removeAllGauges, removeDisabledGauges} from '../../../api/gauges';
import {autofill} from '../../../api/sources';
import {withRouter} from 'react-router'
import {createContainer} from 'meteor/react-meteor-data';
import {Roles} from 'meteor/alanning:roles';
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
        {admin && numGauges == 0 && <FlatButton secondary={true} onTouchTap={this.autofill} label="Autofill"/>}
        {admin && <FlatButton secondary={true} onTouchTap={this.addGauge} label="Add gauge"/>}
        {admin && numGauges > 0 && <FlatButton secondary={true} onTouchTap={this.removeAllGauges} label="Remove all"/>}
        {admin && numGauges > 0 && <FlatButton secondary={true} onTouchTap={this.removeDisabledGauges} style={{marginTop: 16}} label="Remove disabled"/>}
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
    const newGaugeLink = this.props.source ? `/sources/${this.props.params.sourceId}/gauges/new` : '';
    this.props.router.push(newGaugeLink);
  }
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
    admin: Roles.userIsInRole(Meteor.userId(), 'admin'),
    ready: gaugesSubscription.ready() && Roles.subscription.ready(),
    numGauges
  };
}, ListGaugesLeft);

export default withRouter(ListGaugesLeftContainer);