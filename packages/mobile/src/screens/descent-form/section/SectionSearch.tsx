import React, { useState, useCallback } from 'react';
import { Searchbar } from 'react-native-paper';
import SectionSearchList from './SectionSearchList';
import useSearchItems from './useSearchItems';
import useDebounce from 'react-use/lib/useDebounce';
import { LogbookSectionInput } from '@whitewater-guide/logbook-schema';

// tslint:disable-next-line: no-empty-interface
interface Props {
  onSelect?: (value: LogbookSectionInput) => void;
  setSearchMode?: (mode: boolean) => void;
}

const SectionSearch: React.FC<Props> = ({ setSearchMode, onSelect }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  useDebounce(() => setDebouncedSearch(search), 200, [
    search,
    setDebouncedSearch,
  ]);

  const data = useSearchItems(debouncedSearch);

  const onAdd = useCallback(() => {
    setSearchMode?.(false);
  }, [setSearchMode]);

  return (
    <React.Fragment>
      <Searchbar placeholder="Search" onChangeText={setSearch} value={search} />
      <SectionSearchList data={data} onAdd={onAdd} onSelect={onSelect} />
    </React.Fragment>
  );
};

export default SectionSearch;
