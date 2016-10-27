import React, { Component, PropTypes } from 'react';
import withAdmin from '../../hoc/withAdmin';
import FlatLinkButton from '../../components/FlatLinkButton';

class RiverLeft extends Component {

  static propTypes = {
    params: PropTypes.shape({
      riverId: PropTypes.string,
    }),
    admin: PropTypes.bool,
  };

  render() {
    const {admin, params: {riverId}} = this.props;
    return (
      <div style={styles.container}>
        <FlatLinkButton secondary={true} to={`/rivers/${riverId}`} label="Info" />
        {admin && <FlatLinkButton secondary={true} to={`/rivers/${riverId}/settings`} label="Settings" />}
        {admin && <FlatLinkButton secondary={true} to={`/rivers/${riverId}/sections/new`} label="New Section" />}
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

export default withAdmin(RiverLeft);