import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ViewSource extends Component {

  render() {
    return (
      <div style={styles.container}>
        <h1>Source details page stub</h1>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    alignSelf: 'stretch',
  },
};

export default ViewSource;