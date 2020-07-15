import React from 'react';
import { DescentFormScreen } from '../DescentFormContext';
import DescentFormLevelView from './DescentFormLevelView';
import { DescentFormDateNavProps } from '~/screens/descent-form/date/types';

export const DescentFormLevelScreen: React.FC<DescentFormDateNavProps> = (
  props,
) => {
  return (
    <DescentFormScreen safe={true}>
      <DescentFormLevelView {...props} />
    </DescentFormScreen>
  );
};
