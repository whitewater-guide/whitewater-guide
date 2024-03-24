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

interface XTicksProps extends ChartMeta {
  height: number;
}

const XTicks: FC<XTicksProps> = (props) => {
  const { xTickValues, xScale, yScale, height } = props;
  const [tickFont, w, h] = useTicksFont(xTickValues, 16);
  return (
    <>
      {xTickValues.map((v, i) => (
        <React.Fragment key={`xtick${i}`}>
          <Line
            p1={vec(xScale(v), height - 45)}
            p2={vec(xScale(v), yScale(yScale.domain()[1]))}
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
  xTickValues: Date[],
  size = 16,
): [SkFont | null, number, number] {
  const tickFont = useFont(sfMono, size);

  return useMemo(() => {
    if (!tickFont) {
      return [null, 0, size];
    }
    const maxW = xTickValues.reduce((acc, val) => {
      const w = tickFont.getTextWidth(`${val}`);
      return Math.max(w, acc);
    }, size);
    return [tickFont, maxW, size];
  }, [tickFont, xTickValues, size]);
}

export default XTicks;
