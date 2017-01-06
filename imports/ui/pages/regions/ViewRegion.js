import React, {Component, PropTypes} from 'react';

class ViewRegion extends Component {

  static propTypes = {};

  static defaultProps = {};

  render() {
    return (
      <div style={styles.container}>
        <h1>View region page stub</h1>
      </div>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
  },
};

export default ViewRegion;