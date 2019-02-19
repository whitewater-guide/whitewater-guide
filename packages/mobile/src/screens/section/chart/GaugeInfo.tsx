import { Gauge } from '@whitewater-guide/commons';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { Linking, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Popover, PopoverController } from 'react-native-modal-popover';
import { Paragraph, Subheading } from 'react-native-paper';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { compose } from 'recompose';
import { Icon, Left, Right, Row } from '../../../components';
import theme from '../../../theme';

const styles = StyleSheet.create({
  popoverContent: {
    padding: 8,
    backgroundColor: theme.colors.primaryBackground,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

interface OuterProps {
  gauge: Gauge;
  approximate: boolean;
}

type InnerProps = OuterProps & WithI18n & NavigationInjectedProps;

class GaugeInfo extends React.PureComponent<InnerProps> {
  _actionSheet: ActionSheet | null = null;
  _actionSheetOptions: string[];

  constructor(props: InnerProps) {
    super(props);
    this._actionSheetOptions = [
      props.t('section:chart.gaugeMenu.aboutSource'),
      props.t('section:chart.gaugeMenu.webPage'),
      props.t('commons:cancel'),
    ];
  }

  onGaugeAction = (index: number) => {
    const { gauge, navigation, t } = this.props;
    if (index === 1) {
      if (gauge.url) {
        Linking.openURL(gauge.url).catch(() => {});
      }
    } else if (index === 0) {
      navigation.navigate({
        routeName: 'Plain',
        params: {
          title: t('section:chart.gaugeMenu.aboutSource'),
          text: gauge.source.termsOfUse,
        },
      });
    }
  };

  onShowActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show();
    }
  };

  setActionSheet = (ref: ActionSheet | null) => {
    this._actionSheet = ref;
  };

  render() {
    const { gauge, approximate, t } = this.props;
    const { name, lastMeasurement } = gauge;
    const isOutdated = lastMeasurement
      ? moment().diff(lastMeasurement.timestamp, 'days') > 1
      : false;
    return (
      <React.Fragment>
        <Row>
          <Left>
            <Subheading>{t('commons:gauge')}</Subheading>
          </Left>
          <Right row={true}>
            {approximate && (
              <PopoverController>
                {({
                  openPopover,
                  closePopover,
                  popoverVisible,
                  setPopoverAnchor,
                  popoverAnchorRect,
                }) => (
                  <React.Fragment>
                    <Icon
                      icon="alert"
                      size={16}
                      ref={setPopoverAnchor}
                      onPress={openPopover}
                    />
                    <Popover
                      contentStyle={styles.popoverContent}
                      visible={popoverVisible}
                      onClose={closePopover}
                      fromRect={popoverAnchorRect}
                    >
                      <Paragraph>
                        {t('section:chart.approximateWarning')}
                      </Paragraph>
                    </Popover>
                  </React.Fragment>
                )}
              </PopoverController>
            )}
            <Paragraph style={styles.link} onPress={this.onShowActionSheet}>
              {upperFirst(name)}
            </Paragraph>
          </Right>
        </Row>

        <Row>
          <Left>
            <Subheading>{t('section:chart.lastUpdated')}</Subheading>
          </Left>
          <Right row={true}>
            <Paragraph>
              {lastMeasurement
                ? moment(lastMeasurement.timestamp).fromNow()
                : ''}
            </Paragraph>
            {isOutdated && (
              <PopoverController>
                {({
                  openPopover,
                  closePopover,
                  popoverVisible,
                  setPopoverAnchor,
                  popoverAnchorRect,
                }) => (
                  <React.Fragment>
                    <Icon
                      icon="alert"
                      size={16}
                      ref={setPopoverAnchor}
                      onPress={openPopover}
                    />
                    <Popover
                      contentStyle={styles.popoverContent}
                      visible={popoverVisible}
                      onClose={closePopover}
                      fromRect={popoverAnchorRect}
                    >
                      <Paragraph>
                        {t('section:chart.outdatedWarning')}
                      </Paragraph>
                    </Popover>
                  </React.Fragment>
                )}
              </PopoverController>
            )}
          </Right>
        </Row>

        <ActionSheet
          ref={this.setActionSheet}
          title={t('section:chart.gaugeMenu.title')}
          options={this._actionSheetOptions}
          cancelButtonIndex={2}
          onPress={this.onGaugeAction}
        />
      </React.Fragment>
    );
  }
}

export default compose<InnerProps, OuterProps>(
  withNavigation,
  withI18n(),
)(GaugeInfo);
