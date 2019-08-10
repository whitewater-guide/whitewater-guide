import { useContext } from 'react';
import { SetSnackbarContext } from './context';

export const useSnackbarMessage = () => useContext(SetSnackbarContext);
