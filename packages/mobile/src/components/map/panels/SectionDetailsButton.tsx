import { useRegion } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
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
  return (
    <RectButton onPress={onPress}>
      <Button mode="contained" style={styles.button}>
        {t('region:map.selectedSection.details')}
      </Button>
    </RectButton>
  );
});

SectionDetailsButton.displayName = 'SectionDetailsButton';
