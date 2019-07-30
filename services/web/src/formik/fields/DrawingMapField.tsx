import { Coordinate, Coordinate3d } from '@whitewater-guide/commons';
import { useField } from 'formik';
import React from 'react';
import { DrawingMap, DrawingMode } from '../../components/maps';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  drawingMode: DrawingMode;
  bounds: Coordinate[] | null;
}

export const DrawingMapField: React.FC<Props> = React.memo((props) => {
  const { name, drawingMode, bounds } = props;
  const [field] = useField<Coordinate3d[]>(name);
  const { onChange } = useFakeHandlers(name);
  return (
    <DrawingMap
      onChange={onChange}
      bounds={bounds}
      drawingMode={drawingMode}
      points={field.value}
    />
  );
});

DrawingMapField.displayName = 'DrawingMapField';
