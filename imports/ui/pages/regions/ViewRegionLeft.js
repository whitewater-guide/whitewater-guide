import React, { Component, PropTypes } from 'react';
import withAdmin from '../../hoc/withAdmin';
import FlatLinkButton from '../../components/FlatLinkButton';

class ViewSourceLeft extends Component {

  static propTypes = {
    params: PropTypes.shape({
      regionId: PropTypes.string,
    }),
    admin: PropTypes.bool,
  };

  render() {
    const {params: {regionId}} = this.props;
    const toSections = {
      pathname: '/sections',
      query: {
        regionId,
      },
    };
    const toRivers = {
      pathname: '/rivers',
      query: {
        regionId,
      },
    };
    return (
      <div style={styles.container}>
        <FlatLinkButton secondary={true} to={`/regions/${regionId}/map`} label="Region map" />
        <FlatLinkButton secondary={true} to={toRivers} label="Region rivers" />
        <FlatLinkButton secondary={true} to={toSections} label="Region sections" />
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