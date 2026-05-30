import { useRegion } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/schema';

import Markdown from '../../../components/Markdown';
import { RegionBanners } from '../../../features/banners';
import NoRegionDescription from './NoRegionDescription';

function RegionInfoView() {
  const region = useRegion();
  if (!region || !region.description) {
    return <NoRegionDescription />;
  }
  return (
    <>
      <Markdown>{region.description}</Markdown>
      <RegionBanners placement={BannerPlacement.MobileRegionDescription} />
    </>
  );
}

export default RegionInfoView;
