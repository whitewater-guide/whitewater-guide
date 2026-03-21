import { useMapSelection } from '@whitewater-guide/clients';
import React from 'react';
import { Platform } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

import theme from '~/theme';
import useLastNotNull from '~/utils/useLastNotNull';

import { NAVIGATE_BUTTON_HEIGHT } from '../../NavigateButton';
import {
  SECTION_DETAILS_BUTTON_HEIGHT,
  SectionDetailsButton,
} from './SectionDetailsButton';
import { FLOWS_ROW_HEIGHT } from './SectionFlowsRow';
import SelectedElementSheet from './SelectedElementSheet';
import SelectedSectionButtons from './SelectedSectionButtons';
import SelectedSectionHeader from './SelectedSectionHeader';
import SelectedSectionTable from './SelectedSectionTable';

const INSET =
  Platform.OS === 'ios' ? initialWindowMetrics?.insets.bottom ?? 0 : 0;
const SNAP_POINTS: [number, number] = [
  NAVIGATE_BUTTON_HEIGHT + INSET,
  NAVIGATE_BUTTON_HEIGHT +
    theme.rowHeight * 2 +
    FLOWS_ROW_HEIGHT +
    SECTION_DETAILS_BUTTON_HEIGHT +
    INSET,
];

export const SelectedSectionSheet = React.memo(() => {
  const [selection, onSelected] = useMapSelection();
  const section = selection?.__typename === 'Section' ? selection : null;
  // Keep section as state to prevent flash of empty content before panel hides
  const lastSection = useLastNotNull(section);

  return (
    <SelectedElementSheet
      selectionType="Section"
      snapPoints={SNAP_POINTS}
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
