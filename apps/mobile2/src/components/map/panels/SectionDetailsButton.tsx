import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { type RootStackParamsList, Screens } from '../../../core/navigation';

const { width: screenWidth } = Dimensions.get('window');

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
    width: screenWidth,
  },
});

interface Props {
  sectionId?: string | null;
}

export const SectionDetailsButton: React.FC<Props> = memo(({ sectionId }) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();
  const { close } = useBottomSheet();

  const onPress = useCallback(() => {
    if (sectionId) {
      close();
      navigation.navigate(Screens.SECTION_SCREEN, { sectionId });
    }
  }, [sectionId, navigation, close]);

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
