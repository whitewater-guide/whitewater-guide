import { Unit } from '@whitewater-guide/schema';
import React, { useMemo } from 'react';
import { VictoryChartProps } from 'victory-chart';
import { VictoryCommonProps } from 'victory-core';

import { computeChartMeta } from './computeChartMeta';
import HorizontalGrid from './HorizontalGrid';
import HorizontalLabel from './HorizontalLabel';
import HorizontalTick from './HorizontalTick';
import { ChartComponents, ChartMetaSettings, ChartViewProps } from './types';

const SCALE: VictoryCommonProps['scale'] = { x: 'time', y: 'linear' };
const LINE_STYLE = { data: { strokeWidth: 2 } };

type Props = VictoryChartProps & ChartViewProps;

export const createChartView = (
  components: ChartComponents,
  metaSettings?: ChartMetaSettings,
  defaultColor?: string,
): React.ComponentType<Props> => {
  const {
    AxisComponent,
    ChartComponent,
    LineComponent,
    TimeLabelComponent,
    TimeGridComponent,
    HorizontalGridComponent,
    HorizontalLabelComponent,
    HorizontalTickComponent,
  } = components;

  const ChartView: React.FC<Props> = React.memo((props) => {
    const {
      data,
      unit,
      gauge: _g,
      section,
      filter: _f,
      highlightedDate,
      children,
      ...victoryProps
    } = props;

    const binding =
      section && (unit === Unit.LEVEL ? section.levels : section.flows);
    const meta = useMemo(() => computeChartMeta(props, metaSettings), [props]);
    if (!victoryProps.width || !victoryProps.height) {
      return null;
    }

    return (
      <ChartComponent {...victoryProps} scale={SCALE} domain={meta.domain}>
        <AxisComponent
          crossAxis
          tickFormat={meta.xTickFormat}
          tickValues={meta.xTickValues}
          tickLabelComponent={
            <TimeLabelComponent
              days={meta.days}
              highlightedDate={highlightedDate}
            />
          }
          gridComponent={
            <TimeGridComponent
              days={meta.days}
              highlightedDate={highlightedDate}
            />
          }
        />
        <AxisComponent
          crossAxis
          dependentAxis
          tickValues={meta.yTickValues}
          tickComponent={
            <HorizontalTick
              Component={HorizontalTickComponent}
              binding={binding}
              defaultColor={defaultColor}
            />
          }
          tickLabelComponent={
            <HorizontalLabel
              Component={HorizontalLabelComponent}
              binding={binding}
              defaultColor={defaultColor}
            />
          }
          gridComponent={
            <HorizontalGrid
              binding={binding}
              Component={HorizontalGridComponent}
              defaultColor={defaultColor}
            />
          }
        />
        <LineComponent
          data={data}
          x="timestamp"
          y={unit}
          interpolation="linear"
          style={LINE_STYLE}
        />
        {children}
      </ChartComponent>
    );
  });

  ChartView.displayName = 'ChartView';

  return ChartView;
};
