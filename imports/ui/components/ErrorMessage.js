import React, {Component, PropTypes} from 'react';

class ErrorMessage extends Component {
  static propTypes = {
    error: PropTypes.string,
  };

  render() {
    if (!this.props.error)
      return null;
    return (
      <div style={{color: 'rgb(244, 67, 54)'}}>
        {this.props.error}
      </div>
    );
  }
}

export default ErrorMessage;