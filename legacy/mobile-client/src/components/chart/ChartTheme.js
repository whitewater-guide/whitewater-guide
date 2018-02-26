// Based on VictoryTheme.material
import { assign } from 'lodash';
import { StyleSheet } from 'react-native';
import theme from '../../theme';

const colorScale = ['#FFF59D', '#F4511E', '#DCE775', '#8BC34A', '#00796B', '#006064'];
const grey400 = '#BDBDBD';
const grey800 = '#424242';
// *
// * Layout
// *
const padding = 8;
const baseProps = {
  width: 350,
  height: 350,
  padding: 50,
};
// *
// * Labels
// *
const baseLabelStyles = {
  fontFamily: 'Roboto',
  fontSize: 12,
  letterSpacing: 'normal',
  padding,
  fill: theme.colors.textMain,
  stroke: 'transparent',
  strokeWidth: 0,
};

const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles);
// *
// * Strokes
// *
const strokeDasharray = '10, 5';
const strokeLinecap = 'round';
const strokeLinejoin = 'round';

export default {
  area: assign({
    style: {
      data: {
        fill: theme.colors.componentBorder,
      },
      labels: centeredLabelStyles,
    },
  }, baseProps),
  axis: assign({
    style: {
      axis: {
        fill: 'transparent',
        stroke: grey800,
        strokeWidth: 1,
        strokeLinecap,
        strokeLinejoin,
      },
      axisLabel: assign({}, centeredLabelStyles, {
        padding,
        stroke: 'transparent',
      }),
      grid: {
        fill: 'transparent',
        stroke: grey400,
        strokeWidth: StyleSheet.hairlineWidth,
        strokeDasharray,
        strokeLinecap,
        strokeLinejoin,
        pointerEvents: 'none',
      },
      ticks: {
        fill: 'transparent',
        size: 5,
        stroke: grey800,
        strokeWidth: 1,
        strokeLinecap,
        strokeLinejoin,
      },
      tickLabels: assign({}, baseLabelStyles, {
        fill: grey800,
      }),
    },
  }, baseProps),
  bar: assign({
    style: {
      data: {
        fill: theme.colors.componentBorder,
        padding,
        strokeWidth: 0,
        width: 5,
      },
      labels: baseLabelStyles,
    },
  }, baseProps),
  candlestick: assign({
    style: {
      data: {
        stroke: theme.colors.componentBorder,
      },
      labels: centeredLabelStyles,
    },
    candleColors: {
      positive: '#ffffff',
      negative: theme.colors.componentBorder,
    },
  }, baseProps),
  chart: baseProps,
  errorbar: assign({
    style: {
      data: {
        fill: 'transparent',
        opacity: 1,
        stroke: theme.colors.componentBorder,
        strokeWidth: 2,
      },
      labels: centeredLabelStyles,
    },
  }, baseProps),
  group: assign({ colorScale }, baseProps),
  line: assign({
    style: {
      data: {
        fill: 'transparent',
        opacity: 1,
        stroke: theme.colors.componentBorder,
        strokeWidth: 2,
      },
      labels: centeredLabelStyles,
    },
  }, baseProps),
  pie: assign({
    colorScale,
    style: {
      data: {
        padding,
        stroke: theme.colors.border,
        strokeWidth: 1,
      },
      labels: assign({}, baseLabelStyles, { padding: 20 }),
    },
  }, baseProps),
  scatter: assign({
    style: {
      data: {
        fill: theme.colors.componentBorder,
        opacity: 1,
        stroke: 'transparent',
        strokeWidth: 0,
      },
      labels: centeredLabelStyles,
    },
  }, baseProps),
  stack: assign({ colorScale }, baseProps),
  tooltip: {
    style: assign({}, centeredLabelStyles, { padding: 5, pointerEvents: 'none' }),
    flyoutStyle: {
      stroke: theme.colors.textMain,
      strokeWidth: 1,
      fill: '#f0f0f0',
      pointerEvents: 'none',
    },
    cornerRadius: 5,
    pointerLength: 10,
  },
  voronoi: assign({
    style: {
      data: {
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
      },
      labels: assign({}, centeredLabelStyles, { padding: 5, pointerEvents: 'none' }),
      flyout: {
        stroke: theme.colors.textMain,
        strokeWidth: 1,
        fill: '#f0f0f0',
        pointerEvents: 'none',
      },
    },
  }, baseProps),
  legend: {
    colorScale,
    style: {
      data: {
        type: 'circle',
      },
      labels: baseLabelStyles,
    },
  },
};
