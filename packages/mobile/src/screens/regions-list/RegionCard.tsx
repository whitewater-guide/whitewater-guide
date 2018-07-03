import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Caption, Title, TouchableRipple } from 'react-native-paper';
import { Icon, Paper } from '../../components';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { Region } from '../../ww-commons';
import getCoverImage from './getCoverImage';

const styles = StyleSheet.create({
  root: {
    marginHorizontal: theme.margin.single,
    marginVertical: theme.margin.half,
    padding: 0,
  },
  footer: {
    height: 24,
    paddingHorizontal: theme.margin.single,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    alignSelf: 'stretch',
    aspectRatio: 3,
  },
  title: {
    color: theme.colors.textLight,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0.75,
      height: 0.75,
    },
    shadowOpacity: 0.24,
    shadowRadius: 1.5,
  },
  scrim: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.margin.single,
  },
  col: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premium: {
    color: theme.colors.primary,
  },
  premiumUnlocked: {
    color: theme.colors.componentBorder,
  },
});

export const CARD_HEIGHT =
  theme.margin.half * 2 + // root.marginVertical
  (theme.screenWidth - 2 * theme.margin.single) / 3 + // image - card margin horizontal, aspect ratio
  24; // footer

interface Props extends WithT {
  region: Region;
  onPress: (region: Region) => void;
}

export class RegionCard extends React.PureComponent<Props> {
  onPress = () => this.props.onPress(this.props.region);

  renderPremium = () => {
    const { premium, hasPremiumAccess } = this.props.region;
    if (!premium) {
      return null;
    }
    if (hasPremiumAccess) {
      return (
        <React.Fragment>
          <Caption style={styles.premiumUnlocked}>{this.props.t('commons:premium')}</Caption>
          <Icon icon="lock-open-outline" color={theme.colors.componentBorder} size={16} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Caption style={styles.premium}>{this.props.t('commons:premium')}</Caption>
        <Icon icon="lock" color={theme.colors.primary} size={16} />
      </React.Fragment>
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
              <Title style={styles.title}>{region.name}</Title>
            </LinearGradient>
          </Image>
          <View style={styles.footer}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Caption>{`${t('regionsList:sectionsCount')}: ${region.sections.count}`}</Caption>
              </View>
              <View style={styles.col}>
                <Caption>{`${t('regionsList:gaugesCount')}: ${region.gauges.count}`}</Caption>
              </View>
              <View style={styles.col}>
                {this.renderPremium()}
              </View>
            </View>
          </View>
        </Paper>
      </TouchableRipple>
    );
  }
}
