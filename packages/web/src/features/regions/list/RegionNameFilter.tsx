import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  useRegionsSearchString,
  useRegionsSearchStringSetter,
} from '@whitewater-guide/clients';
import React, { useCallback } from 'react';

const RegionNameFilter: React.FC = React.memo(() => {
  const searchString = useRegionsSearchString();
  const setSearchString = useRegionsSearchStringSetter();

  const clearSearchString = useCallback(() => {
    setSearchString('');
  }, [setSearchString]);

  const onSearchStringChange = useCallback(
    (e: any) => {
      setSearchString(e.target.value);
    },
    [setSearchString],
  );

  return (
    <FormControl fullWidth margin="dense">
      <Input
        id="name-filter"
        value={searchString}
        onChange={onSearchStringChange}
        endAdornment={
          searchString ? (
            <InputAdornment position="end">
              <IconButton onClick={clearSearchString} size="small">
                <Icon fontSize="small">cancel</Icon>
              </IconButton>
            </InputAdornment>
          ) : null
        }
        placeholder="Name"
      />
    </FormControl>
  );
});

RegionNameFilter.displayName = 'RegionNameFilter';

export default RegionNameFilter;
