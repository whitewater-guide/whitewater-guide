import { useMapSelection, useRegion } from '@whitewater-guide/clients';
import { isSection } from '@whitewater-guide/commons';
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

export const SelectedSectionView: React.FC = React.memo(() => {
  const region = useRegion();
  const { selection, onSelected } = useMapSelection();
  const section = isSection(selection) ? selection : null;
  // Keep section as state to prevent flash of empty content before panel hides
  const lastSection = useLastNotNull(section);

  const renderHeader = useCallback(() => {
    return <SelectedSectionHeader section={lastSection} region={region} />;
  }, [region, lastSection]);

  const renderContent = useCallback(() => {
    return (
      <React.Fragment>
        <SelectedSectionTable section={lastSection} />
        <SectionDetailsButton sectionId={lastSection && lastSection.id} />
      </React.Fragment>
    );
  }, [lastSection]);

  const premiumGuard = usePremiumGuard(region.node, lastSection);

  const renderButtons = useCallback(
    (scale?: Animated.Node<number>) => {
      return (
        <React.Fragment>
          <NavigateButton
            labelKey="commons:putIn"
            point={lastSection ? lastSection.putIn : null}
            premiumGuard={premiumGuard}
            scale={scale}
          />
          <NavigateButton
            point={lastSection ? lastSection.takeOut : null}
            labelKey="commons:takeOut"
            premiumGuard={premiumGuard}
            scale={scale}
          />
        </React.Fragment>
      );
    },
    [lastSection, premiumGuard],
  );

  return (
    <SelectedElementView
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
