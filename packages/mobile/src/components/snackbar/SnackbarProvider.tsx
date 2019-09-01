import get from 'lodash/get';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SetSnackbarContext, SnackbarContext } from './context';
import { isSnackbarMessage, SnackbarMessage } from './types';

export const SnackbarProvider: React.FC = React.memo(({ children }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState<SnackbarMessage | null>(null);
  const setMessageExt = useCallback(
    (m: SnackbarMessage | Error | null) => {
      if (!m || isSnackbarMessage(m)) {
        setMessage(m);
      } else {
        const id = get(m, 'id') || get(m, 'extensions.id');
        setMessage({
          short: t('errors:default', { id }),
          full: JSON.stringify(m, null, 2),
          error: true,
        });
      }
    },
    [setMessage],
  );
  return (
    <SnackbarContext.Provider value={message}>
      <SetSnackbarContext.Provider value={setMessageExt}>
        {children}
      </SetSnackbarContext.Provider>
    </SnackbarContext.Provider>
  );
});

SnackbarProvider.displayName = 'SnackbarProvider';
