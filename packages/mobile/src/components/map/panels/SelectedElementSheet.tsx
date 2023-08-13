import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ListedSectionFragment } from '@whitewater-guide/clients';
import { PointCoreFragment } from '@whitewater-guide/schema';
import { FC, PropsWithChildren, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

import theme from '~/theme';

import Backdrop from './Backdrop';

const NoHandle = () => null;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.primaryBackground,
  },
  headerTouchable: {
    flex: 1,
  },
  sheetBackground: {
    backgroundColor: theme.colors.primary,
  },
});

interface SelectedElementSheetProps {
  selection: ListedSectionFragment | PointCoreFragment | null;
  onSelected: (node: ListedSectionFragment | PointCoreFragment | null) => void;
  selectionType: 'Point' | 'Section';
  snapPoints: [number, number];
  Header: React.ReactElement;
  Buttons: React.ReactElement;
}

const SelectedElementSheet: FC<PropsWithChildren<SelectedElementSheetProps>> = (
  props,
) => {
  const {
    selection,
    selectionType,
    onSelected,
    snapPoints,
    Header,
    Buttons,
    children,
  } = props;
  const isSelected = selection?.__typename === selectionType;

  const ref = useRef<BottomSheetModal>(null);

  // when selected and was not selected before, tease (index = 1)
  // when deselected and was selected before, close
  useUpdateEffect(() => {
    if (isSelected) {
      // ref.current?.snapToIndex(0);
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [isSelected, ref]);

  // when closed manually, deselect
  const handleClose = useCallback(() => {
    if (isSelected) {
      onSelected(null);
    }
  }, [isSelected, onSelected]);

  // fully open on header tap
  const handleMaximize = useCallback(() => {
    ref.current?.expand();
  }, [ref]);

  return (
    <BottomSheetModal
      ref={ref}
      index={selection ? 0 : -1}
      snapPoints={snapPoints}
      backdropComponent={Backdrop}
      handleComponent={NoHandle}
      onDismiss={handleClose}
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.headerTouchable}>
            <RectButton onPress={handleMaximize} style={styles.headerTouchable}>
              {Header}
            </RectButton>
          </View>

          {Buttons}
        </View>

        {children}
      </View>
    </BottomSheetModal>
  );
};

export default SelectedElementSheet;
