import React, {Component, PropTypes} from 'react';

class ViewSource extends Component {
  static propTypes = {
    sourceContent: PropTypes.element,
  };

  render() {
    return (
      <div style={styles.container}>
        {this.props.sourceContent}
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
}

export default ViewSource;