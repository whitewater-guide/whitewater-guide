import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';

import { registerSnackbarHandler } from './snackbar';

function SnackbarProvider({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    return registerSnackbarHandler(({ text }) => {
      setMessage(text);
      setVisible(true);
    });
  }, []);

  return (
    <>
      {children}
      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={3000}
        >
          {message}
        </Snackbar>
      </Portal>
    </>
  );
}

export default SnackbarProvider;
