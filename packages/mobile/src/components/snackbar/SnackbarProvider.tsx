import React, { useState } from 'react';
import { SetSnackbarContext, SnackbarContext } from './context';
import { SnackbarMessage } from './types';

export const SnackbarProvider: React.FC = React.memo(({ children }) => {
  const [message, setMessage] = useState<SnackbarMessage | null>(null);
  return (
    <SnackbarContext.Provider value={message}>
      <SetSnackbarContext.Provider value={setMessage}>
        {children}
      </SetSnackbarContext.Provider>
    </SnackbarContext.Provider>
  );
});

SnackbarProvider.displayName = 'SnackbarProvider';
