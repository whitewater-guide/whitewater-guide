import React from 'react';
import { DescentFormProvider } from './DescentFormContext';
import DescentFormStack from './DescentFormStack';
import { DescentFormNavProps } from './types';

const DescentFormScreen: React.FC<DescentFormNavProps> = (props) => {
  return (
    <DescentFormProvider {...props}>
      <DescentFormStack />
    </DescentFormProvider>
  );
};

export default DescentFormScreen;
