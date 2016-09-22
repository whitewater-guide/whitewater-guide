import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {removeAllGauges, removeDisabledGauges} from '../../../api/gauges';
import {autofill} from '../../../api/sources';
import {withRouter} from 'react-router'

class ListGaugesLeft extends Component {
  static propTypes = {
    source: PropTypes.object,
    router: PropTypes.object,
  };

  render() {
    const numGauges = this.props.source ? this.props.source.gauges().count() : 0;
    return (
      <div style={styles.container}>
        {numGauges == 0 && <RaisedButton primary onTouchTap={this.autofill} label="Autofill"/>}
        <RaisedButton primary onTouchTap={this.addGauge} label="Add gauge"/>
        {numGauges > 0 && <RaisedButton primary onTouchTap={this.removeAllGauges} label="Remove all"/>}
        {numGauges > 0 && <RaisedButton primary onTouchTap={this.removeDisabledGauges} style={{marginTop: 16}} label="Remove disabled"/>}
      </div>
    );
  }

  removeAllGauges = () => {
    removeAllGauges.callPromise({sourceId: this.props.source._id})
      .then(() => console.log('All gauges removed'))
      .catch(err => console.log(`Error while trying to remove all gauges for source ${this.props.source._id}: ${err}`));
  };

  removeDisabledGauges = () => {
    removeDisabledGauges.callPromise({sourceId: this.props.source._id})
      .then(() => console.log('All disabled gauges removed'))
      .catch(err => console.log(`Error while trying to remove all disabled gauges for source ${this.props.source._id}: ${err}`));
  };

  autofill = () => {
    autofill.callPromise({sourceId: this.props.source._id})
      .then( result => console.log(`Autofill result: ${result}`))
      .catch( error => console.log(`Autofill error: ${error}`));
  };

  addGauge = () => {
    const newGaugeLink = this.props.source ? `/sources/${this.props.source._id}/gauges/new` : '';
    this.props.router.push(newGaugeLink);
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 16,
  },

}

export default withRouter(ListGaugesLeft);