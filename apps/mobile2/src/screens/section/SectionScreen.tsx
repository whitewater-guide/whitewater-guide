import {
  MapSelectionProvider,
  RegionProvider,
  SectionProvider,
  useSection,
} from '@whitewater-guide/clients';
import { Dimensions, PixelRatio } from 'react-native';

import type { SectionScreenProps } from './navigation-types';
import SectionTabs from './SectionTabs';

// Thumbnail size for media nodes fetched by sectionDetails (withMedia: true)
const PHOTO_SIZE_PX = PixelRatio.getPixelSizeForLayoutSize(120);

const { width: screenWidth } = Dimensions.get('window');
const bannerWidth = Math.round(screenWidth * PixelRatio.get());

function SectionScreenInternal() {
  const section = useSection();
  const regionId = section?.region?.id;
  return (
    <RegionProvider
      regionId={regionId}
      bannerWidth={bannerWidth}
      fetchPolicy="cache-first"
    >
      <MapSelectionProvider>
        <SectionTabs />
      </MapSelectionProvider>
    </RegionProvider>
  );
}

function SectionScreen({ route }: SectionScreenProps) {
  const { sectionId } = route.params;
  return (
    <SectionProvider sectionId={sectionId} thumbSize={PHOTO_SIZE_PX}>
      <SectionScreenInternal />
    </SectionProvider>
  );
}

export default SectionScreen;
