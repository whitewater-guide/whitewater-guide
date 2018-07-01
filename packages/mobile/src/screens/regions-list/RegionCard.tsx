import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Caption, Title, TouchableRipple } from 'react-native-paper';
import { Icon, Paper } from '../../components';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { Region } from '../../ww-commons';

const styles = StyleSheet.create({
  root: {
    marginHorizontal: theme.margin.single,
    marginVertical: theme.margin.half,
    padding: 0,
  },
  body: {
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

interface Props extends WithT {
  region: Region;
  onPress: (region: Region) => void;
}

const IMAGES = [
  'https://lh3.googleusercontent.com/TFxsTiivzCSabrn8WrEBV9jb2FQtWxfc6y_CHsbbg8XeW7eZBCLgmMjT3HZz7NHBrh8KuSaGCdwSjUB9TI9CcO9gks7TOCXLRMc6qRJ8WSI99sMMTCTH5oMOzRB7xHsGpsn_08rgAUO3Cfmo19DVSdyWdXnbM9c7gyswo-U1Myc--iOZLu9CoqLTlIHNt9aqnKzP6uByT1JXvaGjkif-GvOll4miwoYJZyEPQQ7PY-4IipUPu48-4zSDlIIbxMhytonIMHUidlhZtJ9MYdlAilhaCViUx7sChux3Xuek9NkKt74KViSrkgxLDk8eIC-PZai2IeaLxQOHX8C-MCrmcIfd4DD9MhAOdEJo4YU0b8Jj6K297yalF4WJnklpg0kQA7myoChrEE9eUKPtoQuNIglrvqV8VLCB2xjhlSEKDVgj1MvriMsYcNvuWmW4_GpHwVBwwEKceI8_ydRmo9yaBNT6lJ1-imYMzP2VK_w-wvdFNbO6-C30_2reFExr03J0YtktYN6FplqPLLADRHAYtkUvNkE_EjRiJCPp_h8Q3kdM=w1024-h576-no',
  'https://explore-laos.com/wp-content/uploads/2015/06/KhonePhapheng.jpg',
  'https://i.pinimg.com/originals/1f/41/f5/1f41f5c73faee77658666cca9f43e276.jpg',
];

class RegionCard extends React.PureComponent<Props> {
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
    const uri = IMAGES[Math.round(Math.random() * (IMAGES.length - 1))];
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
          <View style={styles.body}>
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

export default RegionCard;
