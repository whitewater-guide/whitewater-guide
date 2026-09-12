import { useBottomSheet } from '@gorhom/bottom-sheet';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export const SECTION_DETAILS_BUTTON_HEIGHT = 40;

export interface SectionDetailsButtonProps {
  sectionId?: string | null;
}

export const SectionDetailsButton = memo(
  ({ sectionId }: SectionDetailsButtonProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { close } = useBottomSheet();

    const onPress = useCallback(() => {
      if (sectionId) {
        close();
      }
    }, [sectionId, close]);

    return (
      <Pressable
        onPress={onPress}
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <ThemedText type="smallBold" style={styles.label}>
          {t('commons:seeDetails')}
        </ThemedText>
      </Pressable>
    );
  },
);

SectionDetailsButton.displayName = 'SectionDetailsButton';

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    height: SECTION_DETAILS_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#ffffff',
  },
});
