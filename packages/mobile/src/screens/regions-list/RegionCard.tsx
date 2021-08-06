import { Region } from '@whitewater-guide/schema';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Caption, Title, TouchableRipple } from 'react-native-paper';

import Paper from '~/components/Paper';

import theme from '../../theme';
import DownloadButton from './DownloadButton';
import PremiumBadge from './PremiumBadge';
import useCommonCardProps from './useCommonCardProps';

const FOOTER_HEIGHT = 40;

const styles = StyleSheet.create({
  root: {
    marginHorizontal: theme.margin.single,
    marginVertical: theme.margin.half,
    padding: 0,
  },
  footer: {
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: theme.margin.single,
    alignItems: 'center',
  },
  image: {
    alignSelf: 'stretch',
    aspectRatio: 3,
  },
  title: {
    color: theme.colors.textLight,
    elevation: 2,
    ...theme.shadow,
  },
  scrim: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.margin.single,
  },
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

export const CARD_HEIGHT =
  theme.margin.half * 2 + // root.marginVertical
  (theme.screenWidth - 2 * theme.margin.single) / 3 + // image - card margin horizontal, aspect ratio
  FOOTER_HEIGHT;

interface Props {
  region: Region;
  index: number;
}

export const RegionCard: React.FC<Props> = React.memo(({ region, index }) => {
  const { t } = useTranslation();
  const cardProps = useCommonCardProps(region);
  const uri = region.coverImage.mobile || undefined;
  return (
    <TouchableRipple
      onPress={cardProps.openRegion}
      testID={`RegionCard${index}`}
    >
      <Paper style={styles.root}>
        <Image source={{ uri }} style={styles.image}>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
            style={styles.scrim}
            locations={[0.0, 0.75, 1.0]}
          >
            <DownloadButton
              downloadRegion={cardProps.downloadRegion}
              canMakePayments={cardProps.canMakePayments}
              regionInProgress={cardProps.regionInProgress}
              offlineError={cardProps.offlineError}
              region={region}
            />
            <Title style={styles.title}>{region.name}</Title>
          </LinearGradient>
        </Image>
        <View style={styles.footer}>
          <View style={styles.col}>
            <Caption>{`${t('regionsList:sectionsCount')}: ${
              region.sections?.count
            }`}</Caption>
          </View>
          <View style={styles.col}>
            <Caption>{`${t('regionsList:gaugesCount')}: ${
              region.gauges?.count
            }`}</Caption>
          </View>
          <PremiumBadge
            region={region}
            canMakePayments={cardProps.canMakePayments}
            buyRegion={cardProps.buyRegion}
          />
        </View>
      </Paper>
    </TouchableRipple>
  );
});

RegionCard.displayName = 'RegionCard';
