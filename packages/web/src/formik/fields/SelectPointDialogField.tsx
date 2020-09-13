import {
  Coordinate3d,
  CoordinateLoose,
  CoordinateSchema,
} from '@whitewater-guide/commons';
import { createSafeValidator } from '@whitewater-guide/validation';
import { useField } from 'formik';
import React, { useCallback } from 'react';

import { SelectGeometryDialog } from '../../components/maps';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  bounds: CoordinateLoose[] | null;
  onClose: () => void;
}

const validator = createSafeValidator(CoordinateSchema);

export const SelectPointDialogField: React.FC<Props> = React.memo((props) => {
  const { name, bounds, onClose } = props;
  const [field] = useField<Coordinate3d | undefined>(name);
  const point: Coordinate3d | undefined = field.value;
  const points: Coordinate3d[] | undefined = validator(point)
    ? undefined
    : ([point] as Coordinate3d[]);
  const { onChange } = useFakeHandlers(name);

  const onSubmit = useCallback(
    (result: Coordinate3d[]) => onChange(result[0]),
    [onChange],
  );

  return (
    <SelectGeometryDialog
      drawingMode="Point"
      bounds={bounds}
      onClose={onClose}
      onSubmit={onSubmit}
      points={points}
    />
  );
});

SelectPointDialogField.displayName = 'SelectPointDialogField';
