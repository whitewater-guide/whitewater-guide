import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Route} from 'react-router-dom';

export default class FlatLinkButton extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  };

  render() {
    return (
      <Route children={this.renderChildren}/>
    );
  }

  renderChildren = ({history: {push}}) => {
    const {to, ...buttonProps} = this.props;
    const onTouchTap = () => push(to);
    return (
      <FlatButton {...buttonProps} onTouchTap={onTouchTap}/>
    );
  };

}