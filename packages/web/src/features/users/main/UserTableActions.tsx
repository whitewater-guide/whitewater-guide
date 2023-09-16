import React from 'react';

import { ClickBlocker, DeleteButton } from '../../../components';
import type { UsersTableUserFragment } from './usersTable.generated';

interface Props {
  user: UsersTableUserFragment;
  onRemove?: (id: string) => void;
}

const UserTableActions = React.memo<Props>((props) => {
  const { user, onRemove } = props;
  const { id } = user;
  return (
    <ClickBlocker>
      <DeleteButton id={id} deleteHandler={onRemove} />
    </ClickBlocker>
  );
});

UserTableActions.displayName = 'UserTableActions';

export default UserTableActions;
