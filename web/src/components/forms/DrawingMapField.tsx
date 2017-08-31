import * as React from 'react';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';
import { Coordinate } from '../../ww-commons';
import { DrawingMap, DrawingMode } from '../maps';

interface CustomFieldProps {
  drawingMode: DrawingMode;
  bounds: Coordinate[] | null;
}

type Props = WrappedFieldProps & CustomFieldProps;

const FieldComponent: React.StatelessComponent<Props> = ({ input, meta, ...props }) => (
  <DrawingMap
    onChange={input.onChange}
    bounds={props.bounds}
    drawingMode={props.drawingMode}
    points={input.value}
  />
);

type FieldProps = BaseFieldProps<CustomFieldProps> & CustomFieldProps;

export const DrawingMapField: React.StatelessComponent<FieldProps> = ({ ...props }) => {
  const CustomField = Field as new () => GenericField<CustomFieldProps>;
  return (
    <CustomField {...props} component={FieldComponent} />
  );
};
