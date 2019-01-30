import { IconButtonProps } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import { Node } from '@whitewater-guide/commons';

interface Props<TData = Node> extends IconButtonProps {
  data: TData;
  onPress: (data: TData) => void;
  icon: string;
}

export class IconButtonWithData<TData> extends React.PureComponent<
  Props<TData>
> {
  onClick = () => this.props.onPress(this.props.data);

  render() {
    const { data, icon, ...props } = this.props;
    return (
      <IconButton
        {...props}
        iconClassName="material-icons"
        onClick={this.onClick}
      >
        {icon}
      </IconButton>
    );
  }
}
