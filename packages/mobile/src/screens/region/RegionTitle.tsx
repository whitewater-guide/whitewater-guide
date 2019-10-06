import { REGION_NAME } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/commons';
import React from 'react';
import { useQuery } from 'react-apollo';
import { Text } from 'react-native';
import getTitleFontSize from '../../utils/getTitleFontSize';

interface Props {
  regionId: string;
}

interface Result {
  region: Region;
}

const RegionTitle: React.FC<Props> = ({ regionId }) => {
  const { data } = useQuery<Result>(REGION_NAME, {
    fetchPolicy: 'cache-only',
    variables: { id: regionId },
  });
  const name = data && data.region && data.region.name;
  if (!name) {
    return null;
  }
  return <Text style={{ fontSize: getTitleFontSize(name) }}>{name}</Text>;
};

export default RegionTitle;
