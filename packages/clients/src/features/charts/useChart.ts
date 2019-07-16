import { useContext } from 'react';
import { PureChartContext } from './context';

export const useChart = () => useContext(PureChartContext);
