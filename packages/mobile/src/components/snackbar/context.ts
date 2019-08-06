import React, { useContext } from 'react';
import { SnackbarMessage } from './types';

export const SnackbarContext = React.createContext<SnackbarMessage | null>(
  null,
);
export const SetSnackbarContext = React.createContext<
  (value: SnackbarMessage) => void
>(() => {});
