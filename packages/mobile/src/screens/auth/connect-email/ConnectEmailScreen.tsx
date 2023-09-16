import React, { useRef } from 'react';
import type { View } from 'react-native';

import { AuthScreenBase } from '../AuthScreenBase';
import { ConnectEmailForm } from './ConnectEmailForm';
import type { ConnectEmailNavProps } from './types';

const ConnectEmailScreen: React.FC<ConnectEmailNavProps> = ({
  route: { params },
}) => {
  const keyboardScrollRef = useRef<View>(null);
  return (
    <AuthScreenBase keyboardScrollRef={keyboardScrollRef}>
      <ConnectEmailForm
        keyboardScrollRef={keyboardScrollRef}
        email={params.email}
        token={params.token}
        editableEmail={params.editableEmail}
      />
    </AuthScreenBase>
  );
};

export default ConnectEmailScreen;
