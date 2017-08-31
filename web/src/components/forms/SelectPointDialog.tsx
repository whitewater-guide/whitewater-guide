import * as React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { Coordinate, Coordinate3d } from '../../ww-commons';
import { SelectGeometryDialog } from '../maps/SelectGeometryDialog';

interface CustomFieldProps {
  bounds: Coordinate[] | null;
  onClose: () => void;
}

type Props = WrappedFieldProps & CustomFieldProps;

class SelectPointDialogComponent extends React.PureComponent<Props> {
  onSubmit = (result: Coordinate3d[]) => this.props.input.onChange(result[0]);

  render() {
    const { bounds, onClose } = this.props;
    return (
      <SelectGeometryDialog drawingMode="Point" bounds={bounds} onClose={onClose} onSubmit={this.onSubmit} />
    );
  }
}

type FieldProps = BaseFieldProps<CustomFieldProps> & CustomFieldProps;

const SelectPointDialog: React.StatelessComponent<FieldProps> = ({ ...props }) => {
  const CustomField = Field as new () => GenericField<CustomFieldProps>;
  return (
    <CustomField {...props} component={SelectPointDialogComponent} />
  );
};

export default SelectPointDialog;
