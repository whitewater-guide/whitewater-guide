import React, {Component} from 'react';

class Page403Unauthorized extends Component {
  render() {
    return (
      <div style={styles.container}>
        <h1>403 Unauthorized</h1>
        <img src="//scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/10946551_1585663264982333_313772503_n.jpg"/>
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
}

export default Page403Unauthorized;