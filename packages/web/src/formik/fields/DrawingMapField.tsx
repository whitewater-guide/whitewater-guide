import { useField } from 'formik';
import React from 'react';

import { DrawingMap, DrawingMode } from '../../components/maps';
import { useFakeHandlers } from '../utils';

interface Props {
  name: string;
  drawingMode: DrawingMode;
  bounds: CodegenCoordinates[] | null;
}

export const DrawingMapField = React.memo<Props>((props) => {
  const { name, drawingMode, bounds } = props;
  const [field] = useField<CodegenCoordinates[]>(name);
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
