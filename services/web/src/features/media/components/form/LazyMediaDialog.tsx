import React from 'react';

export const LazyMediaDialog = React.lazy(() => import('./MediaDialog'));

(LazyMediaDialog as any).displayName = 'LazyMediaDialog';
