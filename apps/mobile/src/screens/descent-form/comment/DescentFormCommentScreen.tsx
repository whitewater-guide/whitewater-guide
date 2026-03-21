import React from 'react';

import { DescentFormScreen } from '../DescentFormContext';
import DescentFormCommentView from './DescentFormCommentView';
import type { DescentFormCommentNavProps } from './types';

export const DescentFormCommentScreen: React.FC<
  DescentFormCommentNavProps
> = () => (
  <DescentFormScreen safeBottom>
    <DescentFormCommentView />
  </DescentFormScreen>
);
