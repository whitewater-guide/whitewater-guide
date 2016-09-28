import React, {Component, PropTypes} from 'react';

class ViewSourceLeft extends Component {

  static propTypes = {
    sourceLeft: PropTypes.element,
  };

  render() {
    return (
      <div>
        {this.props.sourceLeft}
      </div>
    );
  }
}

export default ViewSourceLeft;