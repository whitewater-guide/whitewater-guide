import { useApolloClient } from '@apollo/client';
import Box from '@material-ui/core/Box';
import {
  RegionDetailsFragment,
  SectionsListProvider,
  useRegion,
  useSectionsFilterOptions,
  useSectionsList,
} from '@whitewater-guide/clients';
import React, { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { NavTab, NavTabs } from '../../../components/navtabs';
import { RiversList } from '../../rivers/list';
import { SectionsList } from '../../sections/list';
import RegionDetailsLicense from './RegionDetailsLicense';
import RegionDetailsMain from './RegionDetailsMain';
import RegionMapTab from './RegionMapTab';

interface Props {
  region: RegionDetailsFragment;
}

const RegionDetailsTabsInternal: FC<Props> = ({ region }) => {
  const { sections: sectionsOrNull, count } = useSectionsList();
  const { path } = useRouteMatch();
  const sections = sectionsOrNull ?? [];

  return (
    <>
      <NavTabs variant="fullWidth">
        <NavTab label="Info" value="/main" />
        <NavTab label="Map" value="/map" />
        <NavTab label="Rivers" value="/rivers" />
        <NavTab
          label={`Sections (${sections.length}/${count})`}
          value="/sections"
        />
        <NavTab label="Licensing" value="/license" />
      </NavTabs>

      <Box flex={1}>
        <Switch>
          <Route exact path={`${path}/map`}>
            <RegionMapTab region={region} sections={sections} />
          </Route>

          <Route exact path={`${path}/rivers`}>
            <RiversList />
          </Route>

          <Route exact path={`${path}/sections`}>
            <SectionsList sections={sections} regionId={region.id} />
          </Route>

          <Route exact path={`${path}/license`}>
            <RegionDetailsLicense />
          </Route>

          <Route>
            <RegionDetailsMain />
          </Route>
        </Switch>
      </Box>
    </>
  );
};

const RegionDetailsTabs: FC = () => {
  const client = useApolloClient();
  const region = useRegion();
  const filterOptions = useSectionsFilterOptions();

  if (!region) {
    return null;
  }

  return (
    <SectionsListProvider
      regionId={region.id}
      client={client}
      limit={60}
      filterOptions={filterOptions}
    >
      <RegionDetailsTabsInternal region={region} />
    </SectionsListProvider>
  );
};

export default RegionDetailsTabs;
