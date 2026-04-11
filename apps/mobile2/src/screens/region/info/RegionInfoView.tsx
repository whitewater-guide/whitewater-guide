import { useRegion } from '@whitewater-guide/clients';

import Markdown from '../../../components/Markdown';
import NoRegionDescription from './NoRegionDescription';

function RegionInfoView() {
  const region = useRegion();
  if (!region || !region.description) {
    return <NoRegionDescription />;
  }
  return <Markdown>{region.description}</Markdown>;
}

export default RegionInfoView;
