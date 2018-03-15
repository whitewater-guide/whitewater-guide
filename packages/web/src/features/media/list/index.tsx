import * as React from 'react';
import ErrorBoundary from 'react-error-boundary';
import container from './container';
import MediaList from './MediaList';

const SectionMediaWithData = container()(MediaList);

export default () => (
  <ErrorBoundary>
    <SectionMediaWithData/>
  </ErrorBoundary>
);
