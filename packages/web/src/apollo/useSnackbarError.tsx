import { ApolloError } from '@apollo/client';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopy';
import { apolloErrorToString } from '@whitewater-guide/clients';
import { useSnackbar } from 'notistack';
import React, { useCallback } from 'react';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';

export default function useSnackbarError() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [_, copy] = useCopyToClipboard();

  return useCallback(
    (error: ApolloError) => {
      const message = apolloErrorToString(error);

      enqueueSnackbar(message, {
        action: () => (
          <IconButton
            color="inherit"
            onClick={() => {
              copy(JSON.stringify(error, null, 2));
              closeSnackbar();
            }}
          >
            <CopyIcon />
          </IconButton>
        ),
        variant: 'error',
      });
    },
    [copy, enqueueSnackbar, closeSnackbar],
  );
}
