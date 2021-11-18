import { Unit } from '@whitewater-guide/schema';
import React, { useState } from 'react';
import { VictoryChartProps } from 'victory-chart';
import { VictoryCommonProps } from 'victory-core';

import HorizontalGrid from './HorizontalGrid';
import HorizontalLabel from './HorizontalLabel';
import HorizontalTick from './HorizontalTick';
import { ChartComponents, ChartMetaSettings, ChartViewProps } from './types';
import useDomainMeta from './useDomainMeta';
import useTooltipLabel from './useTooltipLabel';
import useXMeta from './useXMeta';
import useZoomedData from './useZoomedData';

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
    ClipContainerComponent,
    ScatterComponent,
    TooltipComponent,
    LineComponent,
    TimeLabelComponent,
    TimeGridComponent,
    HorizontalGridComponent,
    HorizontalLabelComponent,
    HorizontalTickComponent,
    ZoomVoronoiComponent,
  } = components;

  const ChartView: React.FC<Props> = React.memo((props) => {
    const {
      data,
      unit,
      gauge,
      section,
      filter: _f,
      highlightedDate,
      children,
      ...victoryProps
    } = props;

    const binding =
      section && (unit === Unit.LEVEL ? section.levels : section.flows);
    const meta = useDomainMeta(props, metaSettings);
    const tooltipLabel = useTooltipLabel(
      unit,
      gauge.levelUnit,
      gauge.flowUnit,
      gauge.timezone,
    );
    const [zoomedDomain, setZoomedDomain] = useState(meta.domain);
    const zoomedData = useZoomedData(
      data,
      zoomedDomain,
      victoryProps.width,
      metaSettings?.maxDensity,
    );
    const xMeta = useXMeta(zoomedDomain.x, props, metaSettings);

    if (!victoryProps.width || !victoryProps.height) {
      return null;
    }

    return (
      <ChartComponent
        {...victoryProps}
        scale={SCALE}
        domain={meta.domain}
        containerComponent={
          <ZoomVoronoiComponent
            onZoomDomainChange={setZoomedDomain as any}
            zoomDimension="x"
            voronoiPadding={metaSettings?.maxDensity}
            clipContainerComponent={
              <ClipContainerComponent
                clipPadding={{ top: 0, right: 0, left: 0, bottom: 0 }}
              />
            }
          />
        }
      >
        <AxisComponent
          crossAxis
          tickFormat={xMeta.xTickFormat}
          tickValues={xMeta.xTickValues}
          tickLabelComponent={
            <TimeLabelComponent
              days={xMeta.days}
              highlightedDate={highlightedDate}
            />
          }
          gridComponent={
            <TimeGridComponent
              days={xMeta.days}
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
          data={zoomedData}
          x="timestamp"
          y={unit}
          interpolation="linear"
          style={LINE_STYLE}
        />
        <ScatterComponent
          data={zoomedData}
          x="timestamp"
          y={unit}
          labels={tooltipLabel}
          labelComponent={
            <TooltipComponent
              renderInPortal={false}
              gauge={gauge}
              section={section}
              unit={unit}
              highlightedDate={highlightedDate}
            />
          }
        />
        {children}
      </ChartComponent>
    );
  });

  ChartView.displayName = 'ChartView';

  return ChartView;
};
