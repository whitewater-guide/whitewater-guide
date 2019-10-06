import { useRegion } from '@whitewater-guide/clients';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import Screens from '../../../screens/screen-names';

export const SECTION_DETAILS_BUTTON_HEIGHT = 36;

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    height: SECTION_DETAILS_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  sectionId: string | null;
}

export const SectionDetailsButton: React.FC<Props> = memo(({ sectionId }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { node } = useRegion();
  const onPress = useCallback(() => {
    if (sectionId && node) {
      navigate({
        routeName: Screens.Section.Root,
        params: { sectionId, regionId: node.id },
      });
    }
  }, [sectionId, navigate]);
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
    <Button mode="contained" style={styles.button} onPress={onPress}>
      {t('region:map.selectedSection.details')}
    </Button>
  );
});

SectionDetailsButton.displayName = 'SectionDetailsButton';
