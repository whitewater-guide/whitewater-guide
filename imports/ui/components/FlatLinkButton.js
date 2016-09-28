import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {withRouter} from 'react-router';

class FlatLinkButton extends Component {
  static propTypes = {
    to: PropTypes.string,
    router: PropTypes.object,
  }

  render() {
    const {to, router, ...buttonProps} = this.props;
    return (
      <FlatButton {...buttonProps} onTouchTap={() => router.push(to)}/>
    );
  }
}

export default withRouter(FlatLinkButton);