import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ListedSectionFragment } from '@whitewater-guide/clients';
import type { PointCoreFragment } from '@whitewater-guide/schema';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import theme from '../../../theme';
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
  const prevIsSelected = useRef(false);

  // useUpdateEffect: run only on updates, not on mount
  useEffect(() => {
    if (prevIsSelected.current === isSelected) {
      return;
    }
    prevIsSelected.current = isSelected;
    if (isSelected) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [isSelected]);

  const handleClose = useCallback(() => {
    if (isSelected) {
      onSelected(null);
    }
  }, [isSelected, onSelected]);

  const handleMaximize = useCallback(() => {
    ref.current?.expand();
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={Backdrop}
      handleComponent={NoHandle}
      onDismiss={handleClose}
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Pressable style={styles.headerTouchable} onPress={handleMaximize}>
            {Header}
          </Pressable>
          {Buttons}
        </View>
        {children}
      </View>
    </BottomSheetModal>
  );
};

export default SelectedElementSheet;
