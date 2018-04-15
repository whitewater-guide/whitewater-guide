import { IconButtonProps } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import { Node } from '../ww-commons';

interface Props extends IconButtonProps {
  data: Node;
  onPress: (data: Node) => void;
  icon: string;
}

export class IconButtonWithData extends React.PureComponent<Props> {
  onClick = () => this.props.onPress(this.props.data);

  render() {
    const { data, icon, ...props } = this.props;
    return (
      <IconButton {...props} iconClassName="material-icons" onClick={this.onClick}>
        {icon}
      </IconButton>
    );
  }
}