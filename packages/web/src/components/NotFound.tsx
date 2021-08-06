import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React from 'react';

interface Props {
  resource?: string;
  id?: string;
}

export const NotFound = React.memo<Props>((props) => {
  const { resource, id } = props;
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Typography variant="subtitle1">Not found</Typography>
      {!!resource && !!id && (
        <Typography variant="caption">{`The ${resource} with id '${id}' could not be found`}</Typography>
      )}
    </Box>
  );
});

NotFound.displayName = 'NotFound';
