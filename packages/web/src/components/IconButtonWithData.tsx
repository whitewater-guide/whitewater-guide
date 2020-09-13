import Icon from '@material-ui/core/Icon';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import { Node } from '@whitewater-guide/commons';
import React from 'react';

interface Props<TData = Node> extends IconButtonProps {
  data: TData;
  onPress?: (data: TData) => void;
  icon: string;
}

export class IconButtonWithData<TData> extends React.PureComponent<
  Props<TData>
> {
  onClick = () => {
    const { data, onPress } = this.props;
    if (onPress) {
      onPress(data);
    }
  };

  render() {
    const { data, icon, onPress, ...props } = this.props;
    return (
      <IconButton {...props} onClick={this.onClick}>
        <Icon>{icon}</Icon>
      </IconButton>
    );
  }
}
