import { useRegion } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import { WithPremiumDialog } from '../../../../features/purchases';

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props extends WithPremiumDialog {
  section: Section;
}

const PremiumPlaceholder: React.FC<Props> = ({ section, buyRegion }) => {
  const { t } = useTranslation();
  const region = useRegion();
  const onBuy = useCallback(() => {
    if (region.node) {
      buyRegion(region.node, section.id);
    }
  }, [region, section.id, buyRegion]);
  const node = region.node;
  const name = node ? node.name : '';
  return (
    <View style={styles.container}>
      <Caption>{t('iap:section.message', { region: name })}</Caption>
      <Button mode="contained" onPress={onBuy}>
        {t('iap:section.button')}
      </Button>
    </View>
  );
};

export default PremiumPlaceholder;
