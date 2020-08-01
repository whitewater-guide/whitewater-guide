import React from 'react';
import { DescentFormDateNavProps } from '~/screens/descent-form/date/types';
import { DescentFormScreen } from '../DescentFormContext';
import DescentFormLevelView from './DescentFormLevelView';

export const DescentFormLevelScreen: React.FC<DescentFormDateNavProps> = (
  props,
) => {
  return (
    <DescentFormScreen safeBottom={true} padding={true}>
      <DescentFormLevelView {...props} />
    </DescentFormScreen>
  );
};
