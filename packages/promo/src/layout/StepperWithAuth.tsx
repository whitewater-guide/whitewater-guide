import type { AuthService } from '@whitewater-guide/clients';
import { AuthProvider } from '@whitewater-guide/clients';
import React, { Suspense } from 'react';

import Stepper from '../stepper';
import Loading from './Loading';

interface Props {
  service: AuthService;
}

const StepperWithAuth: React.FC<Props> = React.memo(({ service }) => (
  <AuthProvider service={service} renderInitializing={<Loading />}>
    <Suspense fallback={<Loading />}>
      <Stepper />
    </Suspense>
  </AuthProvider>
));

StepperWithAuth.displayName = 'StepperWithAuth';

export default StepperWithAuth;
