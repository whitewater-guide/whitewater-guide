import React, { FC } from 'react';

import { WithSkiaWeb } from './WithSkiaWeb';

export const ChartWeb: FC = () => {
  return (
    <WithSkiaWeb
      getComponent={() => import('./ChartWebBox')}
      fallback={<p>Loading Skia...</p>}
    />
  );
};
