import { WithRegion } from '@whitewater-guide/clients';
import React from 'react';
import { Markdown } from '../../../components';
import NoRegionDescription from './NoRegionDescription';

const RegionInfoView: React.StatelessComponent<WithRegion> = ({
  region: { node },
}) =>
  node && node.description ? (
    <Markdown>{node.description}</Markdown>
  ) : (
    <NoRegionDescription />
  );

export default RegionInfoView;
