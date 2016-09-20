import React, {Component, PropTypes} from 'react';

class ViewSource extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.leftColumn}></div>
        <div style={styles.rightColumn}></div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
  },
  leftColumn: {
    width: 200,
  },
  rightColumn: {
    display: 'flex',
    flex: 1
  },
}

export default ViewSource;