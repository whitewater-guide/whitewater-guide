import MUICheckbox from 'material-ui/Checkbox';
import * as React from 'react';
import { FieldProps } from './types';

const styles = {
  checkbox: {
    maxWidth: 200,
  },
};

interface Props {
  name: string;
  title: string;
  disabled?: boolean;
  dataSource: any[];
  field: FieldProps<boolean>;
  openOnFocus: boolean;
}

export class Checkbox extends React.PureComponent<Props> {
  onCheck = (e: any, v: boolean) => this.props.field.onChange(v);

  render() {
    return (
      <MUICheckbox
        style={styles.checkbox}
        label={this.props.title}
        checked={this.props.field.value}
        onCheck={this.onCheck}
      />
    );
  }
}
