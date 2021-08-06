import Box from '@material-ui/core/Box';
import {
  SectionsListContext,
  SectionsListProvider,
  useRegion,
  useSectionsFilterOptions,
} from '@whitewater-guide/clients';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { Route, Switch } from 'react-router';
import useRouter from 'use-react-router';

import { NavTab, NavTabs } from '../../../components/navtabs';
import { RiversList } from '../../rivers/list';
import { SectionsList } from '../../sections/list';
import RegionDetailsLicense from './RegionDetailsLicense';
import RegionDetailsMain from './RegionDetailsMain';
import RegionMapTab from './RegionMapTab';

const RegionDetailsTabs: React.FC = React.memo(() => {
  const client = useApolloClient();
  const region = useRegion();
  const { match } = useRouter();
  const filterOptions = useSectionsFilterOptions();
  if (!region) {
    return null;
  }
  const regionId = region.id;
  return (
    <SectionsListProvider
      regionId={regionId}
      client={client}
      limit={60}
      filterOptions={filterOptions}
    >
      {({ sections, count }: SectionsListContext) => (
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
              <Route exact path={`${match.path}/map`}>
                <RegionMapTab region={region} sections={sections} />
              </Route>

              <Route exact path={`${match.path}/rivers`}>
                <RiversList />
              </Route>

              <Route exact path={`${match.path}/sections`}>
                <SectionsList sections={sections} regionId={regionId} />
              </Route>

              <Route exact path={`${match.path}/license`}>
                <RegionDetailsLicense />
              </Route>

              <Route>
                <RegionDetailsMain />
              </Route>
            </Switch>
          </Box>
        </>
      )}
    </SectionsListProvider>
  );
});

RegionDetailsTabs.displayName = 'RegionDetailsTabs';

export default RegionDetailsTabs;
