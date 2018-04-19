import React from 'react';
import { Markdown } from '../../../components';
import { RegionConsumer } from '../../../ww-clients/features/regions';
import NoRegionDescription from './NoRegionDescription';

const RegionInfoView: React.StatelessComponent = () => (
  <RegionConsumer>
    {({ node }) => (
      (node && node.description) ?
        <Markdown>{node.description}</Markdown> :
        <NoRegionDescription/>
    )}
  </RegionConsumer>
);

export default RegionInfoView;
