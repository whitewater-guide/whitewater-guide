import { Region } from '@whitewater-guide/commons';
import Icon from 'components/Icon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption, TouchableRipple } from 'react-native-paper';
import theme from '../../theme';

const styles = StyleSheet.create({
  col: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  premium: {
    color: theme.colors.primary,
  },
  premiumUnlocked: {
    color: theme.colors.componentBorder,
  },
  premiumTouchable: {
    flex: 1,
    paddingHorizontal: theme.margin.single,
  },
});

const PREMIUM_HIT_SLOP = { left: 16, right: 8, top: 0, bottom: 0 };

interface Props {
  region: Pick<Region, 'id' | 'premium' | 'hasPremiumAccess'>;
  canMakePayments: boolean;
  buyRegion: () => void;
}

const PremiumBadge: React.FC<Props> = React.memo(
  ({ region, canMakePayments, buyRegion }) => {
    const { hasPremiumAccess, premium } = region;
    const { t } = useTranslation();

    if (!premium || !canMakePayments) {
      return <View style={styles.col} testID="nothing" />;
    }

    if (hasPremiumAccess) {
      return (
        <View style={styles.col}>
          <Caption style={styles.premiumUnlocked}>
            {t('commons:premium')}
          </Caption>
          <Icon
            accessibilityLabel="has premium access"
            icon="lock-open-outline"
            color={theme.colors.componentBorder}
            size={16}
          />
        </View>
      );
    }

    return (
      <View style={styles.col}>
        <TouchableRipple
          onPress={buyRegion}
          hitSlop={PREMIUM_HIT_SLOP}
          style={styles.premiumTouchable}
          accessibilityLabel="buy premium"
        >
          <View style={styles.col}>
            <Caption style={styles.premium}>{t('commons:premium')}</Caption>
            <Icon icon="lock" color={theme.colors.primary} size={16} />
          </View>
        </TouchableRipple>
      </View>
    );
  },
);

PremiumBadge.displayName = 'PremiumBadge';

export default PremiumBadge;
