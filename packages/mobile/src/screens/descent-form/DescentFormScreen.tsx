import React from 'react';
import DescentFormStack from './DescentFormStack';
import { DescentFormProvider } from './DescentFormContext';
import { DescentFormNavProps } from './types';
import ErrorBoundary from '~/components/ErrorBoundary';

const DescentFormScreen: React.FC<DescentFormNavProps> = (props) => {
  return (
    <DescentFormProvider {...props}>
      <DescentFormStack />
    </DescentFormProvider>
  );
};

export default DescentFormScreen;
