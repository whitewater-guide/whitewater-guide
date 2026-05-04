import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Surface, Text, TouchableRipple } from 'react-native-paper';

import { Screens } from '../../../core/navigation/screen-names';
import theme from '../../../theme';
import type { RegionsListScreenProps } from '../navigation-types';
import type { ListedRegion } from '../useFavRegions';
import DownloadButton from './DownloadButton';
import FavoriteButton from './FavoriteButton';

const { width: screenWidth } = Dimensions.get('window');

const FOOTER_HEIGHT = 40;

export const CARD_HEIGHT =
  theme.margin.half * 2 + // root.marginVertical
  (screenWidth - 2 * theme.margin.single) / 3 + // image height (3:1 aspect ratio)
  FOOTER_HEIGHT;

const styles = StyleSheet.create({
  root: {
    marginHorizontal: theme.margin.single,
    marginVertical: theme.margin.half,
    padding: 0,
    overflow: 'hidden',
  },
  footer: {
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    paddingLeft: theme.margin.single,
    alignItems: 'center',
  },
  imageContainer: {
    alignSelf: 'stretch',
    aspectRatio: 3,
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  title: {
    color: theme.colors.textLight,
    elevation: theme.elevation,
    paddingLeft: theme.margin.single,
    ...theme.shadow,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    paddingBottom: theme.margin.half,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
  },
  col: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

interface Props {
  region: ListedRegion;
  index: number;
}

function RegionCardComponent({ region, index }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation<RegionsListScreenProps['navigation']>();

  const openRegion = useCallback(() => {
    navigation.navigate(Screens.REGION_STACK, { regionId: region.id });
  }, [navigation, region.id]);

  const uri = region.coverImage.mobile ?? undefined;

  return (
    <TouchableRipple onPress={openRegion} testID={`RegionCard${index}`}>
      <Surface style={styles.root} elevation={theme.elevation}>
        <View style={styles.imageContainer}>
          <Image source={{ uri }} style={styles.image} />
          <View style={styles.scrim}>
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
              style={styles.gradient}
              locations={[0.0, 0.75, 1.0]}
            />
            <DownloadButton />
            <FavoriteButton regionId={region.id} favorite={region.favorite} />
            <Text variant="titleMedium" style={styles.title}>
              {region.name}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.col}>
            <Text variant="bodySmall">
              {`${t('regionsList:sectionsCount')}: ${region.sections?.count}`}
            </Text>
          </View>
          <View style={styles.col}>
            <Text variant="bodySmall">
              {`${t('regionsList:gaugesCount')}: ${region.gauges?.count}`}
            </Text>
          </View>
          <View style={styles.col} />
        </View>
      </Surface>
    </TouchableRipple>
  );
}

export const RegionCard = memo(RegionCardComponent);
