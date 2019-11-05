import { useField } from 'formik';
import React, { useCallback } from 'react';
import { CoordinateInput, CoordinateInputProps } from '../../components';
import { useFakeHandlers } from '../utils';

interface Props
  extends Omit<CoordinateInputProps, 'value' | 'onChange' | 'onRemove'> {
  name: string;
  index: number;
  onRemove: (index: number) => void;
}

const CoordinateField: React.FC<Props> = React.memo((props) => {
  const { name, index, onRemove, ...coordinateInputProps } = props;
  const [{ value }] = useField<any>(name);
  const { onChange } = useFakeHandlers(name);
  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);
  return (
    <CoordinateInput
      {...coordinateInputProps}
      value={value}
      onChange={onChange}
      onRemove={handleRemove}
    />
  );
});

CoordinateField.displayName = 'CoordinateField';

export default CoordinateField;
