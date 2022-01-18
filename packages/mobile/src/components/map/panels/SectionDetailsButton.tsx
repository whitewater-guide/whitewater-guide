import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import theme from '~/theme';

export const SECTION_DETAILS_BUTTON_HEIGHT = 40;

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    height: SECTION_DETAILS_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 0,
    elevation: 0,
  },
  buttonContent: {
    height: SECTION_DETAILS_BUTTON_HEIGHT,
    width: theme.screenWidth,
  },
});

interface Props {
  sectionId?: string | null;
}

export const SectionDetailsButton: React.FC<Props> = memo(({ sectionId }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { close } = useBottomSheet();

  const onPress = useCallback(() => {
    if (sectionId) {
      close();
      navigate(Screens.SECTION_SCREEN, { sectionId });
    }
  }, [sectionId, navigate, close]);

  return (
    <Button
      mode="contained"
      style={styles.button}
      contentStyle={styles.buttonContent}
      onPress={onPress}
    >
      {t('region:map.selectedSection.details')}
    </Button>
  );
});

SectionDetailsButton.displayName = 'SectionDetailsButton';
