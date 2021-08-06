import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { GroupInput } from '@whitewater-guide/schema';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { ListedGroupFragment } from './listGroups.generated';

type State = ListedGroupFragment | GroupInput;

interface Props {
  group: State;
  onAdd: (group: GroupInput) => void;
  onRemove: (id: string) => void;
}

const GroupForm: FC<Props> = ({ group, onAdd, onRemove }) => {
  const [currentGroup, setCurrentGroup] = useState<State>(group);

  const { id, name, sku } = currentGroup;
  const saveDisabled =
    group.id === id && group.name === name && group.sku === sku;
  const regions = 'regions' in group ? group.regions.nodes : [];

  const onNameChange = (e: any) =>
    setCurrentGroup((g) => ({ ...g, name: e.target.value || null }));

  const onSkuChange = (e: any) =>
    setCurrentGroup((g) => ({ ...g, sku: e.target.value || null }));

  const onSave = () => {
    onAdd({ id, name, sku });
    setCurrentGroup({ id: null, name: '', sku: '' });
  };

  const onDelete = () => {
    if (group.id) {
      onRemove(group.id);
    }
  };

  return (
    <TableRow>
      <TableCell style={{ minWidth: 200 }}>
        <TextField
          fullWidth
          value={name}
          label="Name"
          placeholder="Name"
          onChange={onNameChange}
        />
      </TableCell>

      <TableCell style={{ minWidth: 200 }}>
        <TextField
          fullWidth
          value={sku || ''}
          label="SKU"
          placeholder="SKU"
          onChange={onSkuChange}
        />
      </TableCell>

      <TableCell>
        <div style={{ flex: 1 }}>
          {regions.map((r, i) => (
            <React.Fragment key={r.id}>
              <Link to={`/regions/${r.id}`}>{r.name}</Link>
              {i < regions.length - 1 && ', '}
            </React.Fragment>
          ))}
        </div>
      </TableCell>

      <TableCell style={{ width: 150 }}>
        <IconButton onClick={onSave} disabled={saveDisabled}>
          <Icon>{group.id ? 'save' : 'add'}</Icon>
        </IconButton>
        <IconButton onClick={onDelete} disabled={!group.id}>
          <Icon>delete_forever</Icon>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default GroupForm;
