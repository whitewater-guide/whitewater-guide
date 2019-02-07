import { User } from '@whitewater-guide/commons';
import IconButton from 'material-ui/IconButton';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { UserFinder } from '../../../users';
import ADD_EDITOR_MUTATION from './addEditor.mutation';

interface Props {
  regionId: string;
}

interface InnerProps extends Props {
  addEditor: MutationFn<any, { userId: string; regionId: string }>;
  loading: boolean;
}

interface State {
  user: User | null;
}

class EditorListFooter extends React.PureComponent<InnerProps, State> {
  state: State = { user: null };

  onAdd = () => {
    const { user } = this.state;
    const { regionId, addEditor } = this.props;
    if (user) {
      addEditor({ variables: { regionId, userId: user.id } });
    }
    this.setState({ user: null });
  };

  onChange = (user: User | null) => this.setState({ user });

  render() {
    const { user } = this.state;
    const { loading } = this.props;
    const disabled = loading || !user;
    return (
      <TableRow>
        <TableRowColumn>
          <UserFinder user={user} onChange={this.onChange} />
        </TableRowColumn>
        <TableRowColumn>
          <IconButton
            disabled={disabled}
            iconClassName="material-icons"
            onClick={this.onAdd}
          >
            add
          </IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }
}

const EditorListFooterWithMutation: React.StatelessComponent<Props> = ({
  regionId,
}) => (
  <Mutation mutation={ADD_EDITOR_MUTATION} refetchQueries={['regionEditors']}>
    {(addEditor, { loading }) => (
      <EditorListFooter
        addEditor={addEditor}
        loading={loading}
        regionId={regionId}
      />
    )}
  </Mutation>
);

export default EditorListFooterWithMutation;
