import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import SectionsList from './SectionsList';

const RegionSectionsListScreen: NavigationScreenComponent = () => {
  const { sections, status, refresh } = useSectionsList();
  const { node } = useRegion();
  return (
    <Screen>
      <SectionsList
        status={status}
        sections={sections}
        region={node}
        refresh={refresh}
      />
    </Screen>
  );
};

export default RegionSectionsListScreen;
