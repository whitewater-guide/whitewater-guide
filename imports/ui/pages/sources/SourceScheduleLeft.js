import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class SourceScheduleLeft extends Component {
  
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
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 16,
  },
}

export default SourceScheduleLeft;