import {
  DashPathEffect,
  Line,
  SkFont,
  Text,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import React, { FC, useMemo } from 'react';

import { sfMono } from './fonts';
import { ChartMeta } from './useChartMeta';

type YTicksProps = ChartMeta;

const YTicks: FC<YTicksProps> = (props) => {
  const { yTickValues, xScale, yScale } = props;
  const [tickFont, w, h] = useTicksFont(yTickValues, 16);
  return (
    <>
      {yTickValues.map((v, i) => (
        <React.Fragment key={`yTick${i}`}>
          <Line
            p1={vec(xScale(xScale.domain()[0]) - 5, yScale(v))}
            p2={vec(xScale(xScale.domain()[1]), yScale(v))}
            color="lightgrey"
            style="stroke"
            strokeWidth={1}
          >
            <DashPathEffect intervals={[4, 4]} />
          </Line>
          {!!tickFont && (
            <Text
              x={xScale(xScale.domain()[0]) - w}
              y={yScale(v) + h / 3}
              text={`${v}`}
              font={tickFont}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

// TODO: move to chart meta to account for adjust padding according to widest tick
function useTicksFont(
  yTickValues: number[],
  size = 16,
): [SkFont | null, number, number] {
  const tickFont = useFont(sfMono, size);

  return useMemo(() => {
    if (!tickFont) {
      return [null, 0, size];
    }
    const maxW = yTickValues.reduce((acc, val) => {
      const w = tickFont.getTextWidth(`${val}`);
      return Math.max(w, acc);
    }, size);
    return [tickFont, maxW, size];
  }, [tickFont, yTickValues, size]);
}

export default YTicks;
