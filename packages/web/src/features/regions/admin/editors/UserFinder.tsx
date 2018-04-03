import Downshift from 'downshift';
import React from 'react';
import { User } from '../../../../ww-commons';
import UserAutocompleteWithData from './UserAutocompleteWithData';

const userToString = (user: User | null) => user ? user.name : '';

interface Props {
  user: User | null;
  onChange: (user: User | null) => void;
}

class UserFinder extends React.PureComponent<Props> {
  render() {
    const { user, onChange } = this.props;
    return (
      <Downshift onChange={onChange} selectedItem={user} itemToString={userToString}>
        {({
            inputValue,
            selectedItem,
            isOpen,
            openMenu,
            closeMenu,
            setState,
            selectItem,
          }) =>
          <div>
            <UserAutocompleteWithData
              isOpen={isOpen}
              openMenu={openMenu}
              closeMenu={closeMenu}
              inputValue={inputValue}
              selectItem={selectItem}
              onUpdateInput={setState}
            />
          </div>}
      </Downshift>
    );
  }
}

export default UserFinder;
