import React from 'react';

import type { DescentFormDateNavProps } from '~/screens/descent-form/date/types';

import { DescentFormScreen } from '../DescentFormContext';
import DescentFormLevelView from './DescentFormLevelView';

export const DescentFormLevelScreen: React.FC<DescentFormDateNavProps> = (
  props,
) => (
  <DescentFormScreen safeBottom padding>
    <DescentFormLevelView {...props} />
  </DescentFormScreen>
);
