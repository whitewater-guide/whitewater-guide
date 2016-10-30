import React, { Component, PropTypes } from 'react';
import withAdmin from '../../hoc/withAdmin';
import FlatLinkButton from '../../components/FlatLinkButton';

class SectionsLeft extends Component {

  static propTypes = {
    admin: PropTypes.bool,
  };

  render() {
    return (
      <div style={styles.container}>
        Sections left panel
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

export default withAdmin(SectionsLeft);