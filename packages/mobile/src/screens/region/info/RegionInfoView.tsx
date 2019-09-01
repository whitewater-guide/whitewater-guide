import { useRegion } from '@whitewater-guide/clients';
import React from 'react';
import { Markdown } from '../../../components';
import NoRegionDescription from './NoRegionDescription';

const RegionInfoView: React.FC = () => {
  const { node } = useRegion();
  if (!node || !node.description) {
    return <NoRegionDescription />;
  }
  return <Markdown>{node.description}</Markdown>;
};

RegionInfoView.displayName = 'RegionInfoView';

export default RegionInfoView;
