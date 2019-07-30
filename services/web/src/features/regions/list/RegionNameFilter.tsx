import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import React, { useCallback } from 'react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

const RegionNameFilter: React.FC<Props> = React.memo(
  ({ search, setSearch }) => {
    const clear = useCallback(() => {
      setSearch('');
    }, [setSearch]);
    const setSearchString = useCallback(
      (e: any) => {
        setSearch(e.target.value);
      },
      [setSearch],
    );
    return (
      <FormControl fullWidth={true} margin="dense">
        <Input
          id="name-filter"
          value={search}
          onChange={setSearchString}
          endAdornment={
            search ? (
              <InputAdornment position="end">
                <IconButton onClick={clear} size="small">
                  <Icon fontSize="small">cancel</Icon>
                </IconButton>
              </InputAdornment>
            ) : null
          }
          placeholder="Name"
        />
      </FormControl>
    );
  },
);

RegionNameFilter.displayName = 'RegionNameFilter';

export default RegionNameFilter;
