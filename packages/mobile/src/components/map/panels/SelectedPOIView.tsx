import { useMapSelection, useRegion } from '@whitewater-guide/clients';
import { isPoint } from '@whitewater-guide/commons';
import React, { useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Paragraph } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';
import SelectedPOIHeader from '~/components/map/panels/SelectedPOIHeader';
import { usePremiumGuard } from '~/features/purchases';
import theme from '~/theme';
import useLastNotNull from '~/utils/useLastNotNull';
import { NavigateButton, NAVIGATE_BUTTON_HEIGHT } from '../../NavigateButton';
import SelectedElementView from './SelectedElementView';

const styles = StyleSheet.create({
  content: {
    minHeight: theme.rowHeight * 3 + (initialWindowSafeAreaInsets?.bottom || 0),
    backgroundColor: theme.colors.primaryBackground,
    padding: theme.margin.single,
  },
});

const SNAP_POINTS: [number, number, number] = [
  NAVIGATE_BUTTON_HEIGHT +
    theme.rowHeight * 3 +
    (initialWindowSafeAreaInsets?.bottom || 0),
  NAVIGATE_BUTTON_HEIGHT,
  0,
];

// tslint:disable-next-line: no-shadowed-variable
export const SelectedPOIView: React.FC = React.memo(function SelectedPOIView() {
  const scroll = useRef<ScrollView | null>(null);
  const region = useRegion();
  const { selection, onSelected } = useMapSelection();
  const poi = isPoint(selection) ? selection : null;
  // Keep section as state to prevent flash of empty content before panel hides
  const lastPoi = useLastNotNull(poi);

  const renderContent = useCallback(() => {
    return (
      <ScrollView style={styles.content} ref={scroll}>
        <Paragraph>{lastPoi ? lastPoi.description : ''}</Paragraph>
      </ScrollView>
    );
  }, [lastPoi, scroll]);

  const renderHeader = useCallback(() => {
    return <SelectedPOIHeader poi={lastPoi} />;
  }, [lastPoi]);

  // TODO: poi should be navigatable on demo map section
  const premiumGuard = usePremiumGuard(region.node);

  const renderButtons = useCallback(
    (scale?: Animated.Node<number>) => {
      return (
        <NavigateButton
          labelKey="commons:navigate"
          point={lastPoi}
          premiumGuard={premiumGuard}
          scale={scale}
        />
      );
    },
    [lastPoi, premiumGuard],
  );

  return (
    <SelectedElementView
      selectionType="Point"
      snapPoints={SNAP_POINTS}
      renderHeader={renderHeader}
      renderButtons={renderButtons}
      renderContent={renderContent}
      selection={poi}
      onSelected={onSelected}
      simultaneousHandlers={scroll}
    />
  );
});

SelectedPOIView.displayName = 'SelectedPOIView';
