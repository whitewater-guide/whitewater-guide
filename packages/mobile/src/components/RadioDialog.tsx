import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RadioButton,
  RadioButtonGroup,
  Text,
  TouchableRipple
} from 'react-native-paper';
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
  value?: string;
}

export class RadioDialog extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      value: props.keyExtractor(props.value),
    };
  }

  onValueChange = (value: string) => this.setState({ value });

  openDialog = () => this.setState({ open: true });
  closeDialog = () => this.setState({ open: false });
  submitDialog = () => this.setState({ open: false });

  render() {
    const { dialogTitle, handleTitle, keyExtractor, labelExtractor, value, okLabel, cancelLabel, options } = this.props;
    return (
      <React.Fragment>
        <TouchableRipple onPress={this.openDialog}>
          <Handle>
            <HandleLeft>
              <Text>{handleTitle}</Text>
            </HandleLeft>
            <Text>{labelExtractor(value)}</Text>
          </Handle>
        </TouchableRipple>
        <Dialog onDismiss={this.closeDialog} visible={this.state.open}>
          {
            !!dialogTitle &&
            (
              <DialogTitle>{dialogTitle}</DialogTitle>
            )
          }
          <DialogContent>
            <RadioButtonGroup onValueChange={this.onValueChange} value={this.state.value}>
              {
                options.map((option) => (
                  <TouchableRipple key={keyExtractor(option)} onPress={() => this.onValueChange(keyExtractor(option))}>
                    <Handle>
                      <HandleLeft>
                        <Text>{labelExtractor(option)}</Text>
                      </HandleLeft>
                      <RadioButton value={keyExtractor(option)} />
                    </Handle>
                  </TouchableRipple>
                ))
              }
            </RadioButtonGroup>
          </DialogContent>
          <DialogActions>
            <Button onPress={this.closeDialog}>{cancelLabel || 'Cancel'}</Button>
            <Button primary onPress={this.submitDialog}>{okLabel || 'OK'}</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
