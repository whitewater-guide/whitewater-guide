import { LocationDescriptorObject, Path } from 'history';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Route } from 'react-router-dom';

interface Props {
  to: LocationDescriptorObject | Path;
}

export default class FlatLinkButton extends React.PureComponent<Props> {

  renderChildren = ({ history: { push } }: RouteComponentProps<any>) => {
    const { to, ...buttonProps } = this.props;
    const onTouchTap = () => push(to as any);
    return (
      <FlatButton {...buttonProps} onTouchTap={onTouchTap}/>
    );
  };

  render() {
    return (
      <Route children={this.renderChildren}/>
    );
  }

}
