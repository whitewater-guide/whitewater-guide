import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import DownloadButton from './download-button';
import FavoriteButton from './favorite-button';

const { width: screenWidth } = Dimensions.get('window');

const FOOTER_HEIGHT = 40;
const TITLE_SHADOW = {
  textShadowColor: '#000000',
  textShadowOffset: { width: 0.75, height: 0.75 },
  textShadowRadius: 1.5,
};

export const CARD_HEIGHT =
  Spacing.one * 2 + (screenWidth - 2 * Spacing.two) / 3 + FOOTER_HEIGHT;

export interface ListedRegionCoverImage {
  mobile?: string | null;
}

export interface ListedRegionCount {
  count: number;
}

export interface ListedRegion {
  id: string;
  name: string;
  favorite?: boolean | null;
  gauges?: ListedRegionCount | null;
  sections?: ListedRegionCount | null;
  coverImage: ListedRegionCoverImage;
}

export interface RegionCardProps {
  region: ListedRegion;
  index: number;
}

const GRADIENT_COLORS = [
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0.1)',
  'rgba(0,0,0,0.4)',
] as const;

const GRADIENT_LOCATIONS = [0, 0.75, 1] as const;

function RegionCardComponent({ region, index }: RegionCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const openRegion = useCallback(() => {
    router.push(`/region/${region.id}` as Href);
  }, [router, region.id]);

  const uri = region.coverImage.mobile ?? undefined;

  return (
    <Pressable onPress={openRegion} testID={`RegionCard${index}`}>
      <View
        style={[
          styles.root,
          {
            backgroundColor: theme.background,
            shadowColor: '#000000',
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image source={uri} style={styles.image} contentFit="cover" />
          <View style={styles.scrim}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              style={styles.gradient}
              locations={GRADIENT_LOCATIONS}
            />
            <DownloadButton />
            <FavoriteButton regionId={region.id} favorite={region.favorite} />
            <ThemedText type="smallBold" style={styles.title}>
              {region.name}
            </ThemedText>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.col}>
            <ThemedText type="small">
              {`${t('regionsList:sectionsCount')}: ${region.sections?.count}`}
            </ThemedText>
          </View>
          <View style={styles.col}>
            <ThemedText type="small">
              {`${t('regionsList:gaugesCount')}: ${region.gauges?.count}`}
            </ThemedText>
          </View>
          <View style={styles.col} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    marginHorizontal: Spacing.two,
    marginVertical: Spacing.one,
    padding: 0,
    overflow: 'hidden',
    borderRadius: Spacing.one,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  footer: {
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    paddingLeft: Spacing.two,
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
    color: '#ffffff',
    paddingLeft: Spacing.two,
    ...TITLE_SHADOW,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.one,
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

export const RegionCard = memo(RegionCardComponent);
