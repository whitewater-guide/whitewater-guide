import { sectionName } from '@whitewater-guide/clients';
import type { DescentSectionFragment } from '@whitewater-guide/schema';
import { useState } from 'react';
import { Searchbar } from 'react-native-paper';
import useDebounce from 'react-use/lib/useDebounce';

import SectionSearchList from './SectionSearchList';
import { useSearchSections } from './useSearchSections';

interface Props {
  regionId?: string;
  onSelect?: (value: DescentSectionFragment) => void;
  section?: DescentSectionFragment;
}

function SectionSearch({ regionId, section, onSelect }: Props) {
  const [search, setSearch] = useState(sectionName(section));
  const [debouncedSearch, setDebouncedSearch] = useState(sectionName(section));

  useDebounce(() => setDebouncedSearch(search), 200, [search]);

  const data = useSearchSections(debouncedSearch, section, regionId);

  return (
    <>
      <Searchbar placeholder="Search" onChangeText={setSearch} value={search} />
      <SectionSearchList data={data} onSelect={onSelect} />
    </>
  );
}

export default SectionSearch;
