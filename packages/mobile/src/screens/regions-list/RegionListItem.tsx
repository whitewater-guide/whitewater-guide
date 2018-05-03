import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Subheading, TouchableRipple } from 'react-native-paper';
import { Icon } from '../../components';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { Region } from '../../ww-commons';

export const REGION_ITEM_HEIGHT = 72;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: REGION_ITEM_HEIGHT,
    paddingHorizontal: theme.margin.double,
  },
  row: {
    flexDirection: 'row',
  },
  rivers: {
    width: 75,
  },
  left: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexShrink: 0,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props extends WithT {
  region: Region;
  onPress: (region: Region) => void;
}

class RegionListItem extends React.PureComponent<Props> {
  onPress = () => this.props.onPress(this.props.region);

  render() {
    const { region, t } = this.props;
    return (
      <TouchableRipple onPress={this.onPress}>
        <View style={styles.container}>
          <View style={styles.left}>
            <Subheading>{region.name}</Subheading>
            <View style={styles.row}>
              <Caption style={styles.rivers}>{`${t('regionsList:riversCount')}: ${region.rivers.count}`}</Caption>
              <Caption>{`${t('regionsList:sectionsCount')}: ${region.sections.count}`}</Caption>
            </View>
          </View>
          <View style={styles.right}>
            <Icon color={theme.colors.componentBorder} icon="chevron-right" />
          </View>
        </View>
      </TouchableRipple>
    );
  }
}

export default RegionListItem;
