import Box from '@material-ui/core/Box';
import {
  SectionsListLoader,
  useFilterState,
  useRegion,
} from '@whitewater-guide/clients';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { Route, Switch } from 'react-router';
import useRouter from 'use-react-router';
import { Map } from '../../../components/maps';
import { NavTab, NavTabs } from '../../../components/navtabs';
import { RiversList } from '../../rivers/list';
import { SectionsList } from '../../sections/list';
import RegionDetailsMain from './RegionDetailsMain';

const RegionDetailsTabs: React.FC = React.memo(() => {
  const client = useApolloClient();
  const region = useRegion();
  const { node } = region;
  const { match } = useRouter();
  const searchTerms = useFilterState();
  if (!node) {
    return null;
  }
  const regionId = node.id;
  return (
    <SectionsListLoader
      region={region}
      client={client}
      limit={60}
      searchTerms={searchTerms}
    >
      {({ sections, count }) => (
        <React.Fragment>
          <NavTabs variant="fullWidth">
            <NavTab label="Info" value="/main" />
            <NavTab label="Map" value="/map" />
            <NavTab label="Rivers" value="/rivers" />
            <NavTab
              label={`Sections (${sections.length}/${count})`}
              value={'/sections'}
            />
          </NavTabs>

          <Box flex={1}>
            <Switch>
              <Route exact={true} path={`${match.path}/map`}>
                <Map
                  detailed={false}
                  sections={sections}
                  initialBounds={node.bounds}
                  pois={node.pois}
                />
              </Route>

              <Route exact={true} path={`${match.path}/rivers`}>
                <RiversList />
              </Route>

              <Route exact={true} path={`${match.path}/sections`}>
                <SectionsList sections={sections} regionId={regionId} />
              </Route>

              <Route>
                <RegionDetailsMain />
              </Route>
            </Switch>
          </Box>
        </React.Fragment>
      )}
    </SectionsListLoader>
  );
});

RegionDetailsTabs.displayName = 'RegionDetailsTabs';

export default RegionDetailsTabs;
