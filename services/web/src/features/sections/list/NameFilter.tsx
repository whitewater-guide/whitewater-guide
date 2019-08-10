import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useFilterSetteer, useFilterState } from '@whitewater-guide/clients';
import { DefaultSectionSearchTerms } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';

const NameFilter: React.FC = () => {
  const filter = useFilterState();
  const setFilter = useFilterSetteer();
  const clearSearchString = useCallback(() => {
    setFilter(null);
  }, [setFilter]);
  const setSearchString = useCallback(
    (e: any) => {
      setFilter(
        e.target.value
          ? {
              ...DefaultSectionSearchTerms,
              searchString: e.target.value.toLowerCase(),
            }
          : null,
      );
    },
    [setFilter],
  );
  const value = filter ? filter.searchString : '';
  return (
    <FormControl fullWidth={true} margin="dense">
      <Input
        id="name-filter"
        value={value}
        onChange={setSearchString}
        endAdornment={
          value ? (
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
};

export default NameFilter;
