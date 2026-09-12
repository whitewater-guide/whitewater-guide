import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { PointCoreFragment } from '@whitewater-guide/schema';
import type { PropsWithChildren, ReactElement } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import Backdrop from './backdrop';

import { useTheme } from '@/hooks/use-theme';

import type { MapSection, MapSelectionNode } from '../types';

function NoHandle() {
  return null;
}

export interface SelectedElementSheetProps {
  selection: MapSection | PointCoreFragment | null;
  onSelected: (node: MapSelectionNode | null) => void;
  selectionType: 'Point' | 'Section';
  snapPoints: [number, number];
  Header: ReactElement;
  Buttons: ReactElement;
}

export default function SelectedElementSheet({
  selection,
  selectionType,
  onSelected,
  snapPoints,
  Header,
  Buttons,
  children,
}: PropsWithChildren<SelectedElementSheetProps>) {
  const theme = useTheme();
  const isSelected = selection?.__typename === selectionType;

  const ref = useRef<BottomSheetModal>(null);
  const prevIsSelected = useRef(false);

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
      backgroundStyle={{ backgroundColor: theme.primary }}
    >
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.header,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <Pressable style={styles.headerTouchable} onPress={handleMaximize}>
            {Header}
          </Pressable>
          {Buttons}
        </View>
        {children}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerTouchable: {
    flex: 1,
  },
});
