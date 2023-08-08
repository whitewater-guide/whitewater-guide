import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React, { useState } from 'react';

import { useDeleteMutation } from '../../../apollo';
import { Card } from '../../../layout';
import { RemoveUserDocument } from './removeUser.generated';
import UsersTable from './UsersTable';
import {
  UsersTableDocument,
  useUsersTableLazyQuery,
} from './usersTable.generated';
import UsersTableFinder from './UsersTableFinder';

export const UsersMain: React.FC = () => {
  const [searchString, setSearchString] = useState('');
  const [execute, { data, loading }] = useUsersTableLazyQuery({
    variables: { filter: { searchString } },
  });
  const removeUser = useDeleteMutation(RemoveUserDocument, [
    { query: UsersTableDocument, variables: { filter: { searchString } } },
  ]);

  return (
    <Card>
      <CardHeader title="Users" />
      <CardContent>
        <Box
          display="flex"
          flexDirection="column"
          padding={2}
          style={{ height: '100%' }}
        >
          <UsersTableFinder
            execute={execute}
            input={searchString}
            setInput={setSearchString}
            loading={loading}
          />
          <Box flex={1} alignSelf="stretch">
            <UsersTable users={data?.users ?? []} onRemove={removeUser} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
