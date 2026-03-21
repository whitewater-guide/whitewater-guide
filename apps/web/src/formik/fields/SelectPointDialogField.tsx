import { CoordinateSchema } from '@whitewater-guide/schema';
import { createSafeValidator } from '@whitewater-guide/validation';
import { useField } from 'formik';
import React, { useCallback } from 'react';

import { SelectGeometryDialog } from '../../components/maps';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  bounds: CodegenCoordinates[] | null;
  onClose: () => void;
}

const validator = createSafeValidator(CoordinateSchema);

export const SelectPointDialogField = React.memo<Props>((props) => {
  const { name, bounds, onClose } = props;
  const [field] = useField<CodegenCoordinates | undefined>(name);
  const point: CodegenCoordinates | undefined = field.value;
  const points: CodegenCoordinates[] | undefined = validator(point)
    ? undefined
    : ([point] as CodegenCoordinates[]);
  const { onChange } = useFakeHandlers(name);

  const onSubmit = useCallback(
    (result: CodegenCoordinates[]) => onChange(result[0]),
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
