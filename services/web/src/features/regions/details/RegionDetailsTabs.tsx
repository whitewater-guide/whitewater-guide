import { SectionsListLoader, useRegion } from '@whitewater-guide/clients';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { Route } from 'react-router';
import useRouter from 'use-react-router';
import { Tabs } from '../../../components';
import { Map } from '../../../components/maps';
import { RiversList } from '../../rivers/list';
import { SectionsList } from '../../sections/list';
import RegionDetailsMain from './RegionDetailsMain';

const RegionDetailsTabs: React.FC<WithApolloClient<{}>> = ({ client }) => {
  const region = useRegion();
  const { node } = region;
  const { match } = useRouter();
  if (!node) {
    return null;
  }
  const regionId = node.id;
  return (
    <SectionsListLoader region={region} client={client}>
      {({ sections, count }) => (
        <Tabs fullPathMode={true}>
          <Tab label="Info" value={`/regions/${regionId}#main`}>
            <RegionDetailsMain />
          </Tab>

          <Tab label="Map" value={`/regions/${regionId}#map`}>
            <Map
              detailed={false}
              sections={sections}
              initialBounds={node.bounds}
              pois={node.pois}
            />
          </Tab>

          <Tab label="Rivers" value={`/regions/${regionId}/rivers`}>
            <Route exact={true} path={`${match.path}/rivers`}>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <RiversList />
              </div>
            </Route>
          </Tab>

          <Tab
            label={`Sections (${sections.length}/${count})`}
            value={`/regions/${regionId}/sections`}
          >
            <Route exact={true} path={`${match.path}/sections`}>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <SectionsList sections={sections} regionId={regionId} />
              </div>
            </Route>
          </Tab>
        </Tabs>
      )}
    </SectionsListLoader>
  );
};

export default withApollo(RegionDetailsTabs) as React.ComponentType;
