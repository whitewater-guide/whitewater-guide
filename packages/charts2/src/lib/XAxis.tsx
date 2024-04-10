import { Path, Skia } from '@shopify/react-native-skia';
import type { FC } from 'react';
import { useMemo } from 'react';

import type { Padding } from './math';

interface XAxisProps {
  padding: Padding;
  width: number;
  height: number;
}

const XAxis: FC<XAxisProps> = ({ width, height, padding }) => {
  const { left, right, top, bottom } = padding;

  const path = useMemo(() => {
    // 30 degree arrowhead
    const arrowW = 0.866 * 0.25 * right;
    const arrowH = 0.5 * 0.25 * right;

    return Skia.Path.Make()
      .moveTo(left / 2, height - bottom)
      .lineTo(width - right / 2, height - bottom)
      .rLineTo(-arrowW, -arrowH)
      .rMoveTo(0, 2 * arrowH)
      .rLineTo(arrowW, -arrowH);
  }, [width, height, left, right, bottom]);

  return <Path style="stroke" path={path} strokeWidth={1} color="#F00" />;
};

export default XAxis;
