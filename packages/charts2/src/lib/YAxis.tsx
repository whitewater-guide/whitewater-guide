import { Path, Skia } from '@shopify/react-native-skia';
import type { FC } from 'react';
import { useMemo } from 'react';

import type { Padding } from './math';

interface YAxisProps {
  padding: Padding;
  width: number;
  height: number;
}

const YAxis: FC<YAxisProps> = ({ width, height, padding }) => {
  const { left, right, top, bottom } = padding;

  const path = useMemo(() => {
    // 30 degree arrowhead
    const arrowH = 0.866 * 0.25 * top;
    const arrowW = 0.5 * 0.25 * top;

    return Skia.Path.Make()
      .moveTo(left, height - bottom / 2)
      .lineTo(left, top / 2)
      .rLineTo(-arrowW, arrowH)
      .rMoveTo(2 * arrowW, 0)
      .rLineTo(-arrowW, -arrowH);
  }, [height, left, top, bottom]);

  return <Path style="stroke" path={path} strokeWidth={1} color="#F00" />;
};

export default YAxis;
