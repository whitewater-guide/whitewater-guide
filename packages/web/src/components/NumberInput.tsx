import { TextFieldProps } from 'material-ui';
import TextField from 'material-ui/TextField';
import React from 'react';
import { Overwrite } from 'type-zoo';
import { strToFloat } from '../ww-clients/utils';

interface State {
  value: string;
}

interface NumberInputProps {
  value: undefined | number;
  onChange: (value: number | undefined) => void;
}

type Props = Overwrite<TextFieldProps, NumberInputProps>;

const numToStr = (num: any): string => Number.isFinite(num) ? num!.toString() : '';

/**
 * Wrapper around Material-UI TextInput that makes
 * number inputs agnostic to decimal separator and support both comma and period.
 */
export class NumberInput extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      value: numToStr(props.value),
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const nextVal = nextProps.value;
    if (nextVal !== strToFloat(this.state.value)) {
      this.setState({ value: numToStr(nextVal) });
    }
  }

  onChange = (e: React.FormEvent<{}>) => {
    const { onChange } = this.props;
    this.setState({ value: (e.target as any).value }, () => {
      if (onChange && this.state.value !== '-') {
        const floatVal = strToFloat(this.state.value);
        onChange(Number.isFinite(floatVal) ? floatVal : undefined);
      }
    });
  };

  render() {
    // @ts-ignore
    const pattern: any = { pattern: '(\-)?[0-9]+([\,|\.][0-9]+)?' };
    return (
      <TextField
        {...this.props}
        {...pattern}
        type="text"
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }

}
