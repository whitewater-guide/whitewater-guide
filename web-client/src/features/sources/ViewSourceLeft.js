import React, {Component, PropTypes} from 'react';
import {withAdmin} from '../users';
import {FlatLinkButton} from '../../core/components';

class ViewSourceLeft extends Component {

  static propTypes = {
    sourceLeft: PropTypes.element,
    admin: PropTypes.bool,
    match: PropTypes.object,
  };

  render() {
    const {admin, match: {params: {sourceId}}} = this.props;
    const toGauges = {
      pathname: '/gauges',
      search: `?sourceId=${sourceId}`,
    };
    return (
      <div style={styles.container}>
        {admin && <FlatLinkButton secondary={true} to={`/sources/${sourceId}/schedule`} label="Schedule"/>}
        {admin && <FlatLinkButton secondary={true} to={`/sources/${sourceId}/settings`} label="Settings"/>}
        <FlatLinkButton secondary={true} to={`/sources/${sourceId}/terms_of_use`} label="Terms of use"/>
        <FlatLinkButton secondary={true} to={toGauges} label="Gauges"/>
        {this.props.sourceLeft}
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },

};

export default withAdmin()(ViewSourceLeft);