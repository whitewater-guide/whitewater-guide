import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import type { PropsWithChildren } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * Storybook LiteUI nests its own @gorhom/portal provider and clips the
 * canvas. Gorhom BottomSheetModal must portal inside a host that lives
 * above that UI — a RN Modal with its own provider.
 */
export interface StorySheetModalProps extends PropsWithChildren {
  visible: boolean;
  onRequestClose: () => void;
}

export function StorySheetModal({
  visible,
  onRequestClose,
  children,
}: StorySheetModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
    >
      <GestureHandlerRootView style={styles.flex}>
        <StorySheetProvider>{visible ? children : null}</StorySheetProvider>
      </GestureHandlerRootView>
    </Modal>
  );
}

export function StorySheetProvider({ children }: PropsWithChildren) {
  return (
    <BottomSheetModalProvider>
      <View style={styles.flex} pointerEvents="box-none">
        {children}
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
