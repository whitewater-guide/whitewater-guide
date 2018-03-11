import * as React from 'react';
import ErrorBoundary from 'react-error-boundary';
import container from './conatiner';
import SectionMedia from './SectionMedia';

const SectionMediaWithData = container()(SectionMedia);

export default () => (
  <ErrorBoundary>
    <SectionMediaWithData/>
  </ErrorBoundary>
);
