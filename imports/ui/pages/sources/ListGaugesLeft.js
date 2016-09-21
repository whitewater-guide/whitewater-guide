import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {removeAllGauges, removeDisabledGauges} from '../../../api/gauges';

class ListGaugesLeft extends Component {
  static propTypes = {
    source: PropTypes.object,
  };

  render() {
    return (
      <div style={styles.container}>
        <RaisedButton primary onTouchTap={this.removeAllGauges} label="Remove all"/>
        <RaisedButton primary onTouchTap={this.removeDisabledGauges} style={{marginTop: 16}} label="Remove disabled"/>
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
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 16,
  },

}

export default ListGaugesLeft;