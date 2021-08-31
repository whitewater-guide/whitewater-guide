import { useNavigation } from '@react-navigation/native';
import { useRegion } from '@whitewater-guide/clients';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
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
  const region = useRegion();
  const onPress = useCallback(() => {
    if (sectionId && region) {
      navigate(Screens.SECTION_SCREEN, { sectionId });
    }
  }, [sectionId, navigate, region]);
  // TODO: works on android only: https://github.com/kmagiera/react-native-gesture-handler/pull/537
  if (Platform.OS === 'android') {
    return (
      <RectButton onPress={onPress}>
        <Button mode="contained" style={styles.button}>
          {t('region:map.selectedSection.details')}
        </Button>
      </RectButton>
    );
  }
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
