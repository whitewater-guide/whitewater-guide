import { useRegion } from '@whitewater-guide/clients';
import React from 'react';

import Markdown from '~/components/Markdown';

import NoRegionDescription from './NoRegionDescription';

const RegionInfoView: React.FC = () => {
  const region = useRegion();
  if (!region || !region.description) {
    return <NoRegionDescription />;
  }
  return <Markdown>{region.description}</Markdown>;
};

RegionInfoView.displayName = 'RegionInfoView';

export default RegionInfoView;
