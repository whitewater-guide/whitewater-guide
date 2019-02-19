import { Coordinate, Coordinate3d } from '@whitewater-guide/commons';
import React from 'react';
import {
  BaseFieldProps,
  Field,
  GenericField,
  WrappedFieldProps,
} from 'redux-form';
import { SelectGeometryDialog } from '../maps';

interface CustomFieldProps {
  bounds: Coordinate[] | null;
  onClose: () => void;
}

type Props = WrappedFieldProps & CustomFieldProps;

class SelectPointDialogComponent extends React.PureComponent<Props> {
  onSubmit = (result: Coordinate3d[]) => this.props.input.onChange(result[0]);

  render() {
    const { bounds, onClose, input } = this.props;
    const point: Coordinate3d | undefined = input.value;
    const points: Coordinate3d[] | undefined = point ? [point] : undefined;
    return (
      <SelectGeometryDialog
        drawingMode="Point"
        bounds={bounds}
        onClose={onClose}
        onSubmit={this.onSubmit}
        points={points}
      />
    );
  }
}

type FieldProps = BaseFieldProps<CustomFieldProps> & CustomFieldProps;

const SelectPointDialog: React.StatelessComponent<FieldProps> = ({
  ...props
}) => {
  const CustomField = Field as new () => GenericField<CustomFieldProps>;
  return <CustomField {...props} component={SelectPointDialogComponent} />;
};

export default SelectPointDialog;
