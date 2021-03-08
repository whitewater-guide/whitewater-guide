import React from 'react';
import { Paragraph, RadioButton, TouchableRipple } from 'react-native-paper';

import { Handle, HandleLeft } from './Handle';

interface Props {
  value: string;
  label: string;
  onChange: (key: string) => void;
}

class RadioDialogItem extends React.PureComponent<Props> {
  onPress = () => this.props.onChange(this.props.value);
  render() {
    return (
      <TouchableRipple onPress={this.onPress}>
        <Handle>
          <HandleLeft>
            <Paragraph>{this.props.label}</Paragraph>
          </HandleLeft>
          <RadioButton value={this.props.value} />
        </Handle>
      </TouchableRipple>
    );
  }
}

export default RadioDialogItem;
