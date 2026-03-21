import React, { useRef } from 'react';
import type { View } from 'react-native';

import { AuthScreenBase } from '../AuthScreenBase';
import { ConnectEmailRequestForm } from './ConnectEmailRequestForm';
import type { ConnectEmailRequestNavProps } from './types';

const ConnectEmailRequestScreen: React.FC<ConnectEmailRequestNavProps> = ({
  route: { params },
}) => {
  const keyboardScrollRef = useRef<View>(null);
  return (
    <AuthScreenBase keyboardScrollRef={keyboardScrollRef}>
      <ConnectEmailRequestForm
        keyboardScrollRef={keyboardScrollRef}
        email={params.email}
      />
    </AuthScreenBase>
  );
};

export default ConnectEmailRequestScreen;
