import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import container from './container';
import MediaList from './MediaList';
import { MediaListProps } from './types';

const MediaListWithError: React.StatelessComponent<MediaListProps> = (props) => (
  <ErrorBoundary>
    <MediaList {...props}/>
  </ErrorBoundary>
);

export const MediaListWithData = container()(MediaListWithError);
