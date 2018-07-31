import React from 'react';
import {
  Button,
  Dialog,
  Paragraph,
  RadioButton,
  TouchableRipple,
} from 'react-native-paper';
import theme from '../theme';
import { Handle, HandleLeft } from './Handle';

interface Props {
  handleTitle?: string;
  dialogTitle?: string;
  okLabel?: string;
  cancelLabel?: string;
  value: any;
  options: any[];
  onChange: (value: any) => void;
  keyExtractor: (value: any) => string;
  labelExtractor: (value: any) => string;
}

interface State {
  open: boolean;
  value: string;
}

export class RadioDialog extends React.PureComponent<Props, State> {
  readonly state: State = {
    open: false,
    value: this.props.keyExtractor(this.props.value),
  };

  onValueChange = (value: string) => this.setState({ value });

  openDialog = () => this.setState({ open: true });
  closeDialog = () => this.setState({ open: false });
  submitDialog = () => {
    const { options, keyExtractor, onChange } = this.props;
    const { value } = this.state;
    const option = options.find((o) => keyExtractor(o) === value);
    onChange(option);
    this.closeDialog();
  };

  render() {
    const { dialogTitle, handleTitle, keyExtractor, labelExtractor, value, okLabel, cancelLabel, options } = this.props;
    return (
      <React.Fragment>
        <TouchableRipple onPress={this.openDialog}>
          <Handle>
            <HandleLeft>
              <Paragraph>{handleTitle}</Paragraph>
            </HandleLeft>
            <Paragraph>{labelExtractor(value)}</Paragraph>
          </Handle>
        </TouchableRipple>
        <Dialog onDismiss={this.closeDialog} visible={this.state.open}>
          {
            !!dialogTitle &&
            (
              <Dialog.Title>{dialogTitle}</Dialog.Title>
            )
          }
          <Dialog.Content>
            <RadioButton.Group onValueChange={this.onValueChange} value={this.state.value}>
              {
                options.map((option) => (
                  <TouchableRipple key={keyExtractor(option)} onPress={() => this.onValueChange(keyExtractor(option))}>
                    <Handle>
                      <HandleLeft>
                        <Paragraph>{labelExtractor(option)}</Paragraph>
                      </HandleLeft>
                      <RadioButton value={keyExtractor(option)} />
                    </Handle>
                  </TouchableRipple>
                ))
              }
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={this.closeDialog}>{cancelLabel || 'Cancel'}</Button>
            <Button color={theme.colors.primary} onPress={this.submitDialog}>{okLabel || 'OK'}</Button>
          </Dialog.Actions>
        </Dialog>
      </React.Fragment>
    );
  }
}
