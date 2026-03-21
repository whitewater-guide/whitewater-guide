import CardHeader from '@material-ui/core/CardHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';

import { EditorLanguagePicker } from '../../components/language';
import { Card, CardContent } from '../../layout';
import GroupForm from './GroupForm';
import { useListGroupsQuery } from './listGroups.generated';
import useAddGroup from './useAddGroup';
import useRemoveGroup from './useRemoveGroup';

const GroupsForm: React.FC = React.memo(() => {
  const { data, loading } = useListGroupsQuery({
    fetchPolicy: 'network-only',
  });
  const addGroup = useAddGroup();
  const removeGroup = useRemoveGroup();
  return (
    <Card loading={loading}>
      <CardHeader title="Groups" action={<EditorLanguagePicker />} />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Regions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.groups?.nodes?.map((group) => (
              <GroupForm
                key={group.id}
                group={group}
                onAdd={addGroup}
                onRemove={removeGroup}
              />
            ))}
            <GroupForm
              onAdd={addGroup}
              onRemove={removeGroup}
              group={{ id: null, name: '', sku: '' }}
            />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});

GroupsForm.displayName = 'GroupsForm';

export default GroupsForm;
