import * as React from 'react';
import ErrorBoundary from 'react-error-boundary';
import container from './conatiner';
import MediaList from './MediaList';

const SectionMediaWithData = container()(MediaList);

export default () => (
  <ErrorBoundary>
    <SectionMediaWithData/>
  </ErrorBoundary>
);
