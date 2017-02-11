import React, {Component} from 'react';

export class Page403Unauthorized extends Component {
  render() {
    return (
      <div style={styles.container}>
        <h1>403 Unauthorized</h1>
        <span>Bummer!</span>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
