import Icon from '@material-ui/core/Icon';
import type { IconButtonProps } from '@material-ui/core/IconButton';
import IconButton from '@material-ui/core/IconButton';
import type { Node } from '@whitewater-guide/schema';
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
    onPress?.(data);
  };

  render() {
    const { data: _data, onPress: _onPress, icon, ...props } = this.props;
    return (
      <IconButton {...props} onClick={this.onClick}>
        <Icon>{icon}</Icon>
      </IconButton>
    );
  }
}
