import { useMapSelection, useRegion } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import Animated from 'react-native-reanimated';

import { usePremiumGuard } from '../../../features/purchases';
import theme from '../../../theme';
import useLastNotNull from '../../../utils/useLastNotNull';
import { NAVIGATE_BUTTON_HEIGHT, NavigateButton } from '../../NavigateButton';
import {
  SECTION_DETAILS_BUTTON_HEIGHT,
  SectionDetailsButton,
} from './SectionDetailsButton';
import { FLOWS_ROW_HEIGHT } from './SectionFlowsRow';
import SelectedElementView from './SelectedElementView';
import SelectedSectionHeader from './SelectedSectionHeader';
import SelectedSectionTable from './SelectedSectionTable';

const SNAP_POINTS: [number, number, number] = [
  NAVIGATE_BUTTON_HEIGHT +
    theme.rowHeight * 2 +
    FLOWS_ROW_HEIGHT +
    SECTION_DETAILS_BUTTON_HEIGHT,
  NAVIGATE_BUTTON_HEIGHT,
  0,
];

export const SelectedSectionView = React.memo(() => {
  const region = useRegion();
  const [selection, onSelected] = useMapSelection();
  const section = selection?.__typename === 'Section' ? selection : null;
  // Keep section as state to prevent flash of empty content before panel hides
  const lastSection = useLastNotNull(section);

  const renderHeader = useCallback(
    () => <SelectedSectionHeader section={lastSection} region={region} />,
    [region, lastSection],
  );

  const renderContent = useCallback(
    () => (
      <>
        <SelectedSectionTable section={lastSection} />
        <SectionDetailsButton sectionId={lastSection?.id} />
      </>
    ),
    [lastSection],
  );

  const premiumGuard = usePremiumGuard(region, lastSection);

  const renderButtons = useCallback(
    (scale?: Animated.Node<number>) => (
      <>
        <NavigateButton
          labelKey="commons:putIn"
          point={lastSection?.putIn}
          premiumGuard={premiumGuard}
          scale={scale}
        />
        <NavigateButton
          point={lastSection?.takeOut}
          labelKey="commons:takeOut"
          premiumGuard={premiumGuard}
          scale={scale}
        />
      </>
    ),
    [lastSection, premiumGuard],
  );

  return (
    <SelectedElementView
      selectionType="Section"
      snapPoints={SNAP_POINTS}
      renderHeader={renderHeader}
      renderButtons={renderButtons}
      renderContent={renderContent}
      selection={section}
      onSelected={onSelected}
    />
  );
});

SelectedSectionView.displayName = 'SelectedSectionView';
