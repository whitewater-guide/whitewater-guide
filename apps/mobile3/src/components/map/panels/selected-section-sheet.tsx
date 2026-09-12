import { memo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NAVIGATE_BUTTON_HEIGHT } from '@/components/navigate-button';
import { BottomTabInset, RowHeight } from '@/constants/theme';
import { useLastNotNull } from '@/hooks/use-last-not-null';

import { useMapSelection } from '../map-selection';
import { FLOWS_ROW_HEIGHT } from './section-flows-row';
import { SECTION_DETAILS_BUTTON_HEIGHT, SectionDetailsButton } from './section-details-button';
import SelectedElementSheet from './selected-element-sheet';
import SelectedSectionButtons from './selected-section-buttons';
import SelectedSectionHeader from './selected-section-header';
import SelectedSectionTable from './selected-section-table';

export const SelectedSectionSheet = memo(() => {
  const [selection, onSelected] = useMapSelection();
  const section = selection?.__typename === 'Section' ? selection : null;
  const lastSection = useLastNotNull(section);
  const insets = useSafeAreaInsets();
  const safeBottom = insets.bottom + (Platform.OS === 'android' ? 8 : 0);

  const snapPoints: [number, number] = [
    BottomTabInset + safeBottom,
    safeBottom +
      NAVIGATE_BUTTON_HEIGHT +
      RowHeight * 2 +
      FLOWS_ROW_HEIGHT +
      SECTION_DETAILS_BUTTON_HEIGHT,
  ];

  return (
    <SelectedElementSheet
      selectionType="Section"
      snapPoints={snapPoints}
      Header={<SelectedSectionHeader section={lastSection} />}
      Buttons={<SelectedSectionButtons section={lastSection} />}
      selection={section}
      onSelected={onSelected}
    >
      <SelectedSectionTable section={lastSection} />
      <SectionDetailsButton sectionId={lastSection?.id} />
    </SelectedElementSheet>
  );
});

SelectedSectionSheet.displayName = 'SelectedSectionSheet';
