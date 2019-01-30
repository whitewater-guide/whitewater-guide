import Table, { TableBody, TableFooter } from 'material-ui/Table';
import React from 'react';
import { Mutation, MutationFn, Query, QueryResult } from 'react-apollo';
import { Loading } from '../../../../components';
import { User } from '@whitewater-guide/commons';
import container from './container';
import EditorListFooter from './EditorListFooter';
import EditorListItem from './EditorListItem';
import REGION_EDITORS_QUERY from './editors.query';
import REMOVE_EDITOR_MUTATION from './removeEditor.mutation';

interface Props {
  regionId: string;
}

interface Result {
  editors: User[];
}

const RegionEditors: React.StatelessComponent<Props> = ({ regionId }) => (
  <Query query={REGION_EDITORS_QUERY} variables={{ regionId }}>
    {({ loading, data }: QueryResult<Result, Props>) => {
      if (loading) {
        return <Loading />;
      }
      const editors = data!.editors || [];
      return (
        <Mutation
          mutation={REMOVE_EDITOR_MUTATION}
          refetchQueries={['regionEditors']}
        >
          {(
            removeEditor: MutationFn<any, { userId: string; regionId: string }>,
          ) => (
            <Table selectable={false}>
              <TableBody>
                {editors.map((user) => (
                  <EditorListItem
                    key={user.id}
                    user={user}
                    removeEditor={removeEditor}
                    regionId={regionId}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <EditorListFooter regionId={regionId} />
              </TableFooter>
            </Table>
          )}
        </Mutation>
      );
    }}
  </Query>
);

export const RegionEditorsWithData = container(RegionEditors);
