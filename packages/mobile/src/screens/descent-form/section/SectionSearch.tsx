import { Section } from '@whitewater-guide/commons';
import React, { useState } from 'react';
import { Searchbar } from 'react-native-paper';
import useDebounce from 'react-use/lib/useDebounce';
import SectionSearchList from './SectionSearchList';
import { useSearchSections } from './useSearchSections';

// tslint:disable-next-line: no-empty-interface
interface Props {
  onSelect?: (value: Section) => void;
  section?: Section;
}

const SectionSearch: React.FC<Props> = ({ section, onSelect }) => {
  const [search, setSearch] = useState(section?.name ?? '');
  const [debouncedSearch, setDebouncedSearch] = React.useState(
    section?.name ?? '',
  );

  useDebounce(() => setDebouncedSearch(search), 200, [
    search,
    setDebouncedSearch,
  ]);

  const data = useSearchSections(debouncedSearch);

  return (
    <React.Fragment>
      <Searchbar placeholder="Search" onChangeText={setSearch} value={search} />
      <SectionSearchList data={data} onSelect={onSelect} />
    </React.Fragment>
  );
};

export default SectionSearch;
