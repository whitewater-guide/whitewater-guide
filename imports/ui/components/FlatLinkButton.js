import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {withRouter} from 'react-router';

class FlatLinkButton extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    router: PropTypes.object,
  };

  render() {
    const {to, router, params, location, routes, ...buttonProps} = this.props;
    return (
      <FlatButton {...buttonProps} onTouchTap={() => router.push(to)}/>
    );
  }
}

export default withRouter(FlatLinkButton);