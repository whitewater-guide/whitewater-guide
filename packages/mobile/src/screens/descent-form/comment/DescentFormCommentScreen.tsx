import React from 'react';
import { DescentFormScreen } from '../DescentFormContext';
import DescentFormCommentView from './DescentFormCommentView';
import { DescentFormCommentNavProps } from './types';

export const DescentFormCommentScreen: React.FC<DescentFormCommentNavProps> = () => {
  return (
    <DescentFormScreen safe={true}>
      <DescentFormCommentView />
    </DescentFormScreen>
  );
};
