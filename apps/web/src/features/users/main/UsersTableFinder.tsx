import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import type { FC } from 'react';
import React from 'react';

import { ButtonProgress } from '../../../components';

interface UsersTableFinderProps {
  input: string;
  setInput: (value: string) => void;
  execute: () => void;
  loading?: boolean;
}

const UsersTableFinder: FC<UsersTableFinderProps> = ({
  input,
  setInput,
  execute,
  loading,
}) => {
  return (
    <Box flexDirection="row" display="flex" paddingBottom={2}>
      <TextField
        id="email"
        label="Email"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <ButtonProgress loading={loading}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => execute()}
          disabled={loading}
        >
          Find Users
        </Button>
      </ButtonProgress>
    </Box>
  );
};

export default UsersTableFinder;
