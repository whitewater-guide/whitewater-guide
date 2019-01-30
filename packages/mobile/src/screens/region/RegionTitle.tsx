import get from 'lodash/get';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Text } from 'react-native';
import getTitleFontSize from '../../utils/getTitleFontSize';
import { REGION_NAME } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/commons';

interface Props {
  regionId: string;
}

interface Result {
  region: Region;
}

const RegionTitle: React.StatelessComponent<Props> = ({ regionId }) => (
  <Query
    query={REGION_NAME}
    fetchPolicy="cache-only"
    variables={{ id: regionId }}
  >
    {({ data }: QueryResult<Result>) => {
      const name = get(data, 'region.name', null);
      if (!name) {
        return null;
      }
      return <Text style={{ fontSize: getTitleFontSize(name) }}>{name}</Text>;
    }}
  </Query>
);

export default RegionTitle;
