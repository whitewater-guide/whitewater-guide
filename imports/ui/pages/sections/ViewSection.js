import React, {Component, PropTypes} from 'react';

class ViewSection extends Component {

  render() {
    return (
      <div style={styles.container}>
        <h1>Section details page stub</h1>
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

export default ViewSection;