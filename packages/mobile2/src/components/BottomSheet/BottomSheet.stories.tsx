import BottomSheet from '@gorhom/bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, Text } from 'react-native-paper';

function BottomSheetDemo() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.content}>
        <Text variant="titleMedium">BottomSheet Smoke Test</Text>
        <Button mode="contained" onPress={handleOpen} style={styles.button}>
          Open Bottom Sheet
        </Button>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <View style={styles.sheetContent}>
          <Text variant="titleMedium">Bottom Sheet Content</Text>
          <Text variant="bodyMedium">
            This sheet can be dragged up and down.
          </Text>
          <Button mode="outlined" onPress={handleClose} style={styles.button}>
            Close
          </Button>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  sheetContent: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  button: {
    marginTop: 8,
  },
});

const meta: Meta<typeof BottomSheetDemo> = {
  title: 'BottomSheet',
  component: BottomSheetDemo,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
