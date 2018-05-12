import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import React from 'react';
import { translate } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Popover, PopoverController } from 'react-native-modal-popover';
import { WhitePortal } from 'react-native-portal';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Icon, Left, Right, Row, Text } from '../../../components';
import { WithT } from '../../../i18n';
import theme from '../../../theme';
import { Gauge } from '../../../ww-commons';

const styles = StyleSheet.create({
  popoverContent: {
    padding: 8,
    backgroundColor: theme.colors.primaryBackground,
  },
});

interface Props extends WithT {
  gauge: Gauge;
  approximate: boolean;
  navigate: (to: any) => void;
}

class GaugeInfo extends React.PureComponent<Props> {

  _actionSheet: ActionSheet;
  _actionSheetOptions: string[];

  constructor(props: Props) {
    super(props);
    this._actionSheetOptions = [
      props.t('section:chart.gaugeMenu.aboutSource'),
      props.t('section:chart.gaugeMenu.webPage'),
      props.t('commons:cancel'),
    ];
  }

  onGaugeAction = (index: number) => {
    if (index === 1) {
      Linking.openURL(this.props.gauge.url).catch(() => {});
    } else if (index === 0) {
      this.props.navigate({
        routeName: 'Plain',
        params: {
          data: 'source',
          title: this.props.t('section.chart.gaugeMenu.aboutSource'),
          source: this.props.gauge.source,
        },
      });
    }
  };

  onShowActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show();
    }
  };

  setActionSheet = (ref: ActionSheet) => { this._actionSheet = ref; };

  render() {
    const { gauge, approximate, t } = this.props;
    const { name, lastMeasurement } = gauge;
    const isOutdated = moment().diff(lastMeasurement.timestamp, 'days') > 1;
    return (
      <View>

        <Row>
          <Left><Text>{t('commons:gauge')}</Text></Left>
          <Right flexDirection="row">
            {
              approximate &&
              <PopoverController>
                {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                  <React.Fragment>
                    <Icon icon="warning" size={16} ref={setPopoverAnchor} onPress={openPopover}/>
                    <Popover
                      contentStyle={styles.popoverContent}
                      visible={popoverVisible}
                      onClose={closePopover}
                      fromRect={popoverAnchorRect}
                    >
                      <Text note>{t('section:chart.approximateWarning')}</Text>
                    </Popover>
                  </React.Fragment>
                )}
              </PopoverController>
            }
            <Text onPress={this.onShowActionSheet}>{upperFirst(name)}</Text>
          </Right>
        </Row>

        <WhitePortal name="chartPortal" />

        <Row>
          <Left><Text>{t('section:chart.lastUpdated')}</Text></Left>
          <Right flexDirection="row">
            <Text note>{moment(lastMeasurement.timestamp).fromNow()}</Text>
            {
              isOutdated &&
              <PopoverController>
                {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
                  <React.Fragment>
                    <Icon icon="warning" size={16} ref={setPopoverAnchor} onPress={openPopover}/>
                    <Popover
                      contentStyle={styles.popoverContent}
                      visible={popoverVisible}
                      onClose={closePopover}
                      fromRect={popoverAnchorRect}
                    >
                      <Text note>{t('section:chart.outdatedWarning')}</Text>
                    </Popover>
                  </React.Fragment>
                )}
              </PopoverController>
            }
          </Right>
        </Row>

        <ActionSheet
          ref={this.setActionSheet}
          title={t('section.chart.gaugeMenu.title')}
          options={this._actionSheetOptions}
          cancelButtonIndex={2}
          onPress={this.onGaugeAction}
        />

      </View>
    );
  }

}

export default compose(
  connect(
  undefined,
  { navigate: NavigationActions.navigate },
  ),
  translate(),
)(GaugeInfo);
