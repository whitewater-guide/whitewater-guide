import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  MapSelectionProvider,
  RegionProvider,
  SectionProvider,
  useSection,
} from '@whitewater-guide/clients';
import { Dimensions, PixelRatio } from 'react-native';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
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

type Props = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.SECTION_SCREEN
>;

function SectionScreen({ route }: Props) {
  const { sectionId } = route.params;
  return (
    <SectionProvider sectionId={sectionId} thumbSize={PHOTO_SIZE_PX}>
      <SectionScreenInternal />
    </SectionProvider>
  );
}

export default SectionScreen;
