import PropTypes from 'prop-types';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { upperFirst } from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { WhitePortal } from 'react-native-portal';
import ActionSheet from 'react-native-actionsheet';
import Popover, { PopoverTouchable } from 'react-native-modal-popover';
import { ListItem, Left, Right, Text, Icon } from '../../../components';
import theme from '../../../theme';
import I18n from '../../../i18n';

const styles = StyleSheet.create({
  popoverContent: {
    padding: 8,
    backgroundColor: theme.colors.mainBackground,
  },
});

const OPTIONS = [
  I18n.t('section.chart.gaugeMenu.aboutSource'),
  I18n.t('section.chart.gaugeMenu.webPage'),
  I18n.t('commons.cancel'),
];

class GaugeInfo extends React.PureComponent {

  static propTypes = {
    gauge: PropTypes.object,
    approximate: PropTypes.bool,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._actionSheet = null;
  }

  onGaugeAction = (index) => {
    if (index === 1) {
      Linking.openURL(this.props.gauge.url).catch(() => {});
    } else if (index === 0) {
      this.props.navigate({
        routeName: 'Plain',
        params: { data: 'source', title: I18n.t('section.chart.gaugeMenu.aboutSource'), source: this.props.gauge.source },
      });
    }
  };

  onShowActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show();
    }
  };

  setActionSheet = (ref) => { this._actionSheet = ref; };

  render() {
    const { gauge, approximate } = this.props;
    const { name, lastTimestamp } = gauge;
    const isOutdated = moment().diff(lastTimestamp, 'days') > 1;
    return (
      <View>

        <ListItem>
          <Left><Text>{I18n.t('commons.gauge')}</Text></Left>
          <Right flexDirection="row">
            {
              approximate &&
              <PopoverTouchable>
                <Icon icon="warning" size={16} />
                <Popover contentStyle={styles.popoverContent}>
                  <Text note>{I18n.t('section.chart.approximateWarning')}</Text>
                </Popover>
              </PopoverTouchable>
            }
            <Text link onPress={this.onShowActionSheet}>{upperFirst(name)}</Text>
          </Right>
        </ListItem>

        <WhitePortal name="chartPortal" />

        <ListItem>
          <Left><Text>{I18n.t('section.chart.lastUpdated')}</Text></Left>
          <Right flexDirection="row">
            <Text note>{moment(lastTimestamp).fromNow()}</Text>
            {
              isOutdated &&
              <PopoverTouchable>
                <Icon icon="warning" size={16} />
                <Popover contentStyle={styles.popoverContent}>
                  <Text note>{I18n.t('section.chart.outdatedWarning')}</Text>
                </Popover>
              </PopoverTouchable>
            }
          </Right>
        </ListItem>

        <ActionSheet
          ref={this.setActionSheet}
          title={I18n.t('section.chart.gaugeMenu.title')}
          options={OPTIONS}
          cancelButtonIndex={2}
          onPress={this.onGaugeAction}
        />

      </View>
    );
  }

}

export default connect(
  undefined,
  { navigate: NavigationActions.navigate },
)(GaugeInfo);
