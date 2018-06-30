import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from 'react-native-fast-image';
import { Caption, Title, TouchableRipple } from 'react-native-paper';
import { Paper } from '../../components';
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
    aspectRatio: 16 / 9,
  },
});

interface Props extends WithT {
  region: Region;
  onPress: (region: Region) => void;
}

class RegionCard extends React.PureComponent<Props> {
  onPress = () => this.props.onPress(this.props.region);

  render() {
    const { region, t } = this.props;
    return (
      <TouchableRipple onPress={this.onPress}>
        <Paper style={styles.root}>
          <Image
            source={{ uri: 'https://i.pinimg.com/originals/1f/41/f5/1f41f5c73faee77658666cca9f43e276.jpg' }}
            style={styles.image}
          />
          <View style={styles.body}>
            <Title>{region.name}</Title>
            <View style={styles.row}>
              <Caption>{`${t('regionsList:sectionsCount')}: ${region.sections.count}`}</Caption>
              <Caption>{`${t('regionsList:gaugesCount')}: ${region.gauges.count}`}</Caption>
            </View>
          </View>
        </Paper>
      </TouchableRipple>
    );
  }
}

export default RegionCard;
