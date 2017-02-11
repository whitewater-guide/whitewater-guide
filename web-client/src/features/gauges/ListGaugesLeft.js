import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {FlatLinkButton} from '../../core/components';
import container from './ListGaugesLeftContainer';

class ListGaugesLeft extends Component {
  static propTypes = {
    sourceId: PropTypes.string.isRequired,
    admin: PropTypes.bool.isRequired,
    count: PropTypes.number,
    router: PropTypes.object.isRequired,
    removeGauges: PropTypes.func,
    setEnabled: PropTypes.func,
    autofill: PropTypes.func,
    generateSchedule: PropTypes.func,
  };

  render() {
    const {admin, count, sourceId} = this.props;
    const hasGauges = admin && count > 0;
    const toNewGauge = {
      pathname: '/gauges/new',
      query: {
        sourceId,
      },
    };
    return (
      <div style={styles.container}>
        {admin && <FlatLinkButton secondary={true} to={toNewGauge} label="Add gauge"/>}
        {admin && !count && <FlatButton secondary={true} onTouchTap={this.autofill} label="Autofill" />}
        {hasGauges && <FlatButton secondary={true} onTouchTap={this.generateSchedule} label="Generate crons"/>}
        {hasGauges && <FlatButton secondary={true} onTouchTap={this.enableAll} label="Enable all"/>}
        {hasGauges && <FlatButton secondary={true} onTouchTap={this.disableAll} label="Disable all"/>}
        {hasGauges && <FlatButton secondary={true} onTouchTap={this.removeAllGauges} label="Remove all" />}
        {hasGauges && <FlatButton secondary={true} onTouchTap={this.removeDisabledGauges} label="Remove disabled"/>}
        <FlatLinkButton secondary={true} to={`/sources/${sourceId}/terms_of_use`} label="Terms of use" />
      </div>
    );
  }

  removeAllGauges = () => this.props.removeGauges(this.props.sourceId, false);
  removeDisabledGauges = () => this.props.removeGauges(this.props.sourceId, true);
  enableAll = () => this.props.setEnabled(this.props.sourceId, true);
  disableAll = () => this.props.setEnabled(this.props.sourceId, false);
  autofill = () => this.props.autofill(this.props.sourceId);
  generateSchedule = () => this.props.generateSchedule(this.props.sourceId);

}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
};

export default container(ListGaugesLeft);