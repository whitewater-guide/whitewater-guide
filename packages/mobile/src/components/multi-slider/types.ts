import { ViewProps } from 'react-native';

export interface RangeSliderDefaultProps {
  range: [number, number];
  values: [number, number];
  step: number;
  behavior?: 'block' | 'continue' | 'invert';
}

export interface RangeSliderProps extends RangeSliderDefaultProps, ViewProps {
  onChange?: (values: [number, number]) => void;
  onChangeEnd?: (values: [number, number]) => void;
}
