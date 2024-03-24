import type { FC } from 'react';
import React from 'react';

import { WithSkiaWeb } from './WithSkiaWeb';

export const ChartWeb: FC = () => {
  return (
    <WithSkiaWeb
      getComponent={() => import('./ChartWebBox')}
      fallback={<p>Loading Skia...</p>}
    />
  );
};
