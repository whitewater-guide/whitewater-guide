import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { User } from '../../../../ww-commons';
import FIND_USERS_QUERY from './users.query';

const DATA_SOURCE_CONFIG = { text: 'name', value: 'id' };

const LOADING_DATA_SOURCE = [
  {
    name: 'Loading',
    id: (
      <MenuItem primaryText="Loading" />
    ),
  },
];

const EMPTY_DATA_SOURCE = [
  {
    name: 'No users found',
    id: (
      <MenuItem primaryText="No users found" />
    ),
  },
];

const filterFunction = (searchText: string, key: string) =>
  searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;

interface UserAutocompleteProps {
  isOpen: boolean;
  inputValue: string | null;
  onUpdateInput: (v: {inputValue: string}) => void;
  selectItem: (item: User) => void;
  closeMenu: () => void;
  openMenu: () => void;
}

type InnerProps = ChildProps<UserAutocompleteProps, { users: User[] }>;

class UserAutocomplete extends React.PureComponent<InnerProps> {
  getDataSource = () => {
    const { users, loading } = this.props.data!;
    if (loading) {
      return LOADING_DATA_SOURCE;
    }
    return (users && users.length) ? users : EMPTY_DATA_SOURCE;
  };

  onNewRequest = (user: User, index: number) => {
    if (index >= 0) {
      this.props.selectItem(user);
    }
  };

  onUpdateInput = (inputValue: string) => this.props.onUpdateInput({ inputValue });

  onClose = () => this.props.closeMenu();

  onFocus = () => this.props.openMenu();

  render() {
    const { inputValue, onUpdateInput, isOpen } = this.props;
    return (
      <AutoComplete
        hintText="Select user"
        searchText={inputValue || ''}
        filter={filterFunction}
        onUpdateInput={this.onUpdateInput}
        onNewRequest={this.onNewRequest}
        dataSourceConfig={DATA_SOURCE_CONFIG}
        dataSource={this.getDataSource()}
        open={isOpen}
        onClose={this.onClose}
        onFocus={this.onFocus}
      />
    );
  }
}

const UserAutocompleteWithData = graphql<UserAutocompleteProps>(FIND_USERS_QUERY)(
  UserAutocomplete,
);

export default UserAutocompleteWithData;
