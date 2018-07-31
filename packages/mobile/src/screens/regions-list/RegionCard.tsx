import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Caption, Title, TouchableRipple } from 'react-native-paper';
import { Icon, Paper } from '../../components';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { Region } from '../../ww-commons';
import DownloadButton from './DownloadButton';
import getCoverImage from './getCoverImage';

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

const PREMIUM_HIT_SLOP = { left: 16, right: 8, top: 0, bottom: 0 };

interface Props extends WithT {
  region: Region;
  onPress: (region: Region) => void;
  onPremiumPress: (region: Region) => void;
  canMakePayments: boolean;
  openDownloadDialog: (region: Region) => void;
  regionInProgress: string | null;
}

export class RegionCard extends React.PureComponent<Props> {
  onPress = () => this.props.onPress(this.props.region);
  onPremiumPress = () => this.props.onPremiumPress(this.props.region);
  onDownloadPress = () => {
    const { region, onPremiumPress, openDownloadDialog } = this.props;
    if (!region.premium || region.hasPremiumAccess) {
      openDownloadDialog(region);
    } else {
      onPremiumPress(region);
    }
  };

  renderDownloadButton = () => {
    const { regionInProgress, region, canMakePayments } = this.props;
    const { premium, hasPremiumAccess } = region;
    if (premium && !hasPremiumAccess && !canMakePayments) {
      return null;
    }
    return (
      <DownloadButton
        onPress={this.onDownloadPress}
        inProgress={regionInProgress === region.id}
        disabled={!!regionInProgress && regionInProgress !== region.id}
      />
    );
  };

  renderPremium = () => {
    const { premium, hasPremiumAccess } = this.props.region;
    if (!premium || !this.props.canMakePayments) {
      return (
        <View style={styles.col} />
      );
    }
    if (hasPremiumAccess) {
      return (
        <View style={styles.col}>
          <Caption style={styles.premiumUnlocked}>{this.props.t('commons:premium')}</Caption>
          <Icon icon="lock-open-outline" color={theme.colors.componentBorder} size={16} />
        </View>
      );
    }
    return (
      <View style={styles.col}>
        <TouchableRipple onPress={this.onPremiumPress} hitSlop={PREMIUM_HIT_SLOP} style={styles.premiumTouchable}>
          <View style={styles.col}>
            <Caption style={styles.premium}>{this.props.t('commons:premium')}</Caption>
            <Icon icon="lock" color={theme.colors.primary} size={16} />
          </View>
        </TouchableRipple>
      </View>
    );
  };

  render() {
    const { region, t } = this.props;
    const uri = getCoverImage(region.coverImage.mobile);
    return (
      <TouchableRipple onPress={this.onPress}>
        <Paper style={styles.root}>
          <Image source={{ uri }} style={styles.image}>
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
              style={styles.scrim}
              locations={[0.0, 0.75, 1.0]}
            >
              {this.renderDownloadButton()}
              <Title style={styles.title}>{region.name}</Title>
            </LinearGradient>
          </Image>
          <View style={styles.footer}>
            <View style={styles.col}>
              <Caption>{`${t('regionsList:sectionsCount')}: ${region.sections!.count}`}</Caption>
            </View>
            <View style={styles.col}>
              <Caption>{`${t('regionsList:gaugesCount')}: ${region.gauges!.count}`}</Caption>
            </View>
            {this.renderPremium()}
          </View>
        </Paper>
      </TouchableRipple>
    );
  }
}
