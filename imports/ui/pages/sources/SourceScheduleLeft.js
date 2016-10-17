import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import withAdmin from '../../hoc/withAdmin';
import {startJobs, removeJobs} from '../../../api/sources';

class SourceScheduleLeft extends Component {
  
  static propTypes = {
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
    source: PropTypes.object,
    admin: PropTypes.bool,
  };

  render() {
    const {admin} = this.props;
    //TODO: clean all jobs or prohibit if jobs exist
    return (
      <div style={styles.container}>
        {admin && <FlatButton secondary={true} onTouchTap={this.startJobs} label="Start jobs"/>}
        {admin && <FlatButton secondary={true} onTouchTap={this.removeJobs} label="Stop jobs"/>}
      </div>
    );
  }

  startJobs = () => {
    startJobs.callPromise({sourceId: this.props.params.sourceId})
      .then(() => console.log('Started'))
      .catch(err => console.log(`Error while trying to start jobs for source ${this.props.source._id}: ${err}`));
  }

  removeJobs = () => {
    removeJobs.callPromise({sourceId: this.props.params.sourceId})
      .then(() => console.log('Removed'))
      .catch(err => console.log(`Error while trying to remove jobs for source ${this.props.source._id}: ${err}`));
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

export default withAdmin(SourceScheduleLeft);