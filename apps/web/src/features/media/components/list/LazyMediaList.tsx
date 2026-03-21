import React from 'react';

export const LazyMediaList = React.lazy(() => import('./MediaList'));
(LazyMediaList as any).displayName = 'LazyMediaList';
