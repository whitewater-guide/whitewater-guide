import type { Meta, StoryObj } from '@storybook/react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StoryButton } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

function BottomSheetDemo() {
  const [open, setOpen] = useState(false);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="subtitle">BottomSheet</ThemedText>
        <StoryButton label="Open to peek" onPress={handleOpen} />
      </View>
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <GestureHandlerRootView style={styles.modalRoot}>
          <BottomSheet
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            enableDynamicSizing={false}
            onClose={handleClose}
          >
            <View style={styles.sheetContent}>
              <ThemedText type="smallBold">Bottom Sheet Content</ThemedText>
              <ThemedText>This sheet can be dragged up and down.</ThemedText>
              <StoryButton
                label="Close"
                variant="outlined"
                onPress={handleClose}
              />
            </View>
          </BottomSheet>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  modalRoot: {
    flex: 1,
  },
  sheetContent: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/BottomSheet',
  component: BottomSheetDemo,
} satisfies Meta<typeof BottomSheetDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
