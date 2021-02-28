import noop from 'lodash/noop';
import React from 'react';

import { SnackbarMessage } from './types';

export const SnackbarContext = React.createContext<SnackbarMessage | null>(
  null,
);
export const SetSnackbarContext = React.createContext<
  (value: SnackbarMessage | Error | null) => void
>(noop);
