import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {withRouter} from 'react-router';
import omit from 'lodash/omit';

class FlatLinkButton extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    router: PropTypes.object,
  };

  render() {
    const buttonProps = omit(this.props, ['to', 'router', 'params', 'location', 'routes']);
    return (
      <FlatButton {...buttonProps} onTouchTap={this.onTouchTap}/>
    );
  }

  onTouchTap = () => {
    const {to, router} = this.props;
    router.push(to);
  };

}

export default withRouter(FlatLinkButton);