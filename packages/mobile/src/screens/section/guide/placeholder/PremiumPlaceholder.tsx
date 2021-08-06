import { SectionDetailsFragment, useRegion } from '@whitewater-guide/clients';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';

import { usePremiumGuard } from '../../../../features/purchases';

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  section: SectionDetailsFragment;
}

const PremiumPlaceholder: React.FC<Props> = ({ section }) => {
  const { t } = useTranslation();
  const region = useRegion();
  const onBuy = usePremiumGuard(region, section);
  const name = region?.name ?? '';
  return (
    <View style={styles.container}>
      <Caption>
        {t('screens:section.guide.premiumMessage', { region: name })}
      </Caption>
      <Button mode="contained" onPress={onBuy}>
        {t('screens:section.guide.premiumButton')}
      </Button>
    </View>
  );
};

export default PremiumPlaceholder;
