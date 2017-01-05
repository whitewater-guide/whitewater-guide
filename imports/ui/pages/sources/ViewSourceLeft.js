import React, { Component, PropTypes } from 'react';
import withAdmin from '../../hoc/withAdmin';
import FlatLinkButton from '../../components/FlatLinkButton';

class ViewSourceLeft extends Component {

  static propTypes = {
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
    sourceLeft: PropTypes.element,
    admin: PropTypes.bool,
  };

  render() {
    const {admin, params: {sourceId}} = this.props;
    const toGauges = {
      pathname: '/gauges',
      query: {
        sourceId,
      },
    };
    return (
      <div style={styles.container}>
        {admin && <FlatLinkButton secondary={true} to={`/sources/${sourceId}/schedule`} label="Schedule" />}
        {admin && <FlatLinkButton secondary={true} to={`/sources/${sourceId}/settings`} label="Settings" />}
        <FlatLinkButton secondary={true} to={`/sources/${sourceId}/terms_of_use`} label="Terms of use" />
        <FlatLinkButton secondary={true} to={toGauges} label="Gauges" />
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

export default withAdmin(ViewSourceLeft);