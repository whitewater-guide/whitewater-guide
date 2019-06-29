import { useRegion } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Screens from '../../../screens/screen-names';

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
  },
});

interface Props {
  sectionId: string | null;
}

const SectionDetailsButton: React.FC<Props> = memo(({ sectionId }) => {
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
    <Button mode="contained" onPress={onPress} style={styles.button}>
      {t('region:map.selectedSection.details')}
    </Button>
  );
});

SectionDetailsButton.displayName = 'SectionDetailsButton';

export default SectionDetailsButton;
