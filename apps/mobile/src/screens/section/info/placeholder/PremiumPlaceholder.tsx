import type { SafeSectionDetails } from '@whitewater-guide/clients';
import { useRegion } from '@whitewater-guide/clients';
import noop from 'lodash/noop';
import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';

import { useRegionPremiumCallback } from '~/features/purchases';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingBottom: theme.margin.single,
  },
});

interface Props {
  section: SafeSectionDetails;
}

const PremiumPlaceholder: FC<Props> = ({ section }) => {
  const { t } = useTranslation();
  const region = useRegion();
  const [onBuy] = useRegionPremiumCallback(section, noop);
  const name = region?.name ?? '';

  return (
    <View style={styles.container}>
      <Caption>
        {t('screens:section.info.description.premiumMessage', { region: name })}
      </Caption>
      <Button mode="contained" onPress={onBuy}>
        {t('screens:section.info.description.premiumButton')}
      </Button>
    </View>
  );
};

export default PremiumPlaceholder;
