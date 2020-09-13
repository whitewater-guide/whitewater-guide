import { Section, sectionName } from '@whitewater-guide/commons';
import React, { useState } from 'react';
import { Searchbar } from 'react-native-paper';
import useDebounce from 'react-use/lib/useDebounce';

import SectionSearchList from './SectionSearchList';
import { useSearchSections } from './useSearchSections';

interface Props {
  regionId?: string;
  onSelect?: (value: Section) => void;
  section?: Section;
}

const SectionSearch: React.FC<Props> = ({ regionId, section, onSelect }) => {
  const [search, setSearch] = useState(sectionName(section));
  const [debouncedSearch, setDebouncedSearch] = React.useState(
    sectionName(section),
  );

  useDebounce(() => setDebouncedSearch(search), 200, [
    search,
    setDebouncedSearch,
  ]);

  const data = useSearchSections(debouncedSearch, section, regionId);

  return (
    <React.Fragment>
      <Searchbar placeholder="Search" onChangeText={setSearch} value={search} />
      <SectionSearchList data={data} onSelect={onSelect} />
    </React.Fragment>
  );
};

export default SectionSearch;
