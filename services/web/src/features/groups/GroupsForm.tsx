import { CardMedia } from 'material-ui/Card';
import {
  default as Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table';
import React from 'react';
import { Content } from '../../components';
import { EditorLanguagePicker } from '../../components/language';
import { CardHeader } from '../../layout';
import GroupForm from './GroupForm';
import { GroupsFormProps } from './types';

export default class GroupsForm extends React.PureComponent<GroupsFormProps> {
  render() {
    const { groups, upsertGroup, removeGroup } = this.props;
    return (
      <Content card={true}>
        <CardHeader title="Groups">
          <EditorLanguagePicker />
        </CardHeader>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
            <Table selectable={false}>
              <TableHeader enableSelectAll={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>SKU</TableHeaderColumn>
                  <TableHeaderColumn>Regions</TableHeaderColumn>
                  <TableHeaderColumn style={{ width: 150 }}>
                    Actions
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.nodes.map((group) => (
                  <GroupForm
                    key={group.id}
                    group={group}
                    upsertGroup={upsertGroup}
                    removeGroup={removeGroup}
                  />
                ))}
                <GroupForm
                  upsertGroup={upsertGroup}
                  removeGroup={removeGroup}
                  group={{ id: null, name: '', sku: '' }}
                />
              </TableBody>
            </Table>
          </div>
        </CardMedia>
      </Content>
    );
  }
}
