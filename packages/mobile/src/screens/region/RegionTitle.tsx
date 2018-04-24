import get from 'lodash/get';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { REGION_NAME } from '../../ww-clients/features/regions';
import { Region } from '../../ww-commons';

interface Props {
  regionId: string;
}

interface Result {
  region: Region;
}

const RegionTitle: React.StatelessComponent<Props> = ({ regionId }) => (
  <Query query={REGION_NAME} fetchPolicy="cache-only" variables={{ id: regionId }}>
    {({ data }: QueryResult<Result>) => (
      get(data, 'region.name', null)
    )}
  </Query>
);

export default RegionTitle;
