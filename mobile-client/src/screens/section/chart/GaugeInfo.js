import PropTypes from 'prop-types';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { upperFirst } from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { WhitePortal } from 'react-native-portal';
import ActionSheet from 'react-native-actionsheet';
import { ListItem, Left, Right, Text, Icon, Popover } from '../../../components';
import theme from '../../../theme';

const styles = StyleSheet.create({
  popoverContent: {
    padding: 8,
    backgroundColor: theme.colors.mainBackground,
  },
});

const OPTIONS = ['About data source', 'Open gauge web page', 'Cancel'];

class GaugeInfo extends React.PureComponent {

  static propTypes = {
    gauge: PropTypes.object,
    approximate: PropTypes.bool,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showPopover: false,
      popoverMessage: '',
      popoverAnchor: { x: 0, y: 0, width: 1, height: 1 },
    };
    this._approximateIcon = null;
    this._outdatedIcon = null;
    this._actionSheet = null;
  }

  onGaugeAction = (index) => {
    if (index === 1) {
      Linking.openURL(this.props.gauge.url).catch(() => {});
    } else if (index === 0) {
      this.props.navigate({
        routeName: 'Plain',
        params: { data: 'source', source: this.props.gauge.source },
      });
    }
  };

  onShowActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show();
    }
  };

  setApproximateIcon = (ref) => { this._approximateIcon = ref ? ref.root : null; };
  setOutdatedIcon = (ref) => { this._outdatedIcon = ref ? ref.root : null; };
  setActionSheet = (ref) => { this._actionSheet = ref; };

  showApproximatePopover = () => {
    this._approximateIcon.measure((ox, oy, width, height, x, y) => {
      this.setState({
        showPopover: true,
        popoverMessage: 'This gauge gives very approximate\ndata for this river!',
        popoverAnchor: { x, y, width, height },
      });
    });
  };

  showOutdatedPopover = () => {
    this._outdatedIcon.measure((ox, oy, width, height, x, y) => {
      this.setState({
        showPopover: true,
        popoverMessage: 'This data is probably outdated :(',
        popoverAnchor: { x, y, width, height },
      });
    });
  };

  hidePopover = () => this.setState({ showPopover: false });

  render() {
    const { gauge, approximate } = this.props;
    const { name, lastTimestamp } = gauge;
    const isOutdated = moment().diff(lastTimestamp, 'days') > 1;
    return (
      <View>

        <ListItem>
          <Left><Text>Gauge</Text></Left>
          <Right flexDirection="row">
            {
              approximate &&
              <Icon iconRef={this.setApproximateIcon} icon="warning" size={16} onPress={this.showApproximatePopover} />
            }
            <Text link onPress={this.onShowActionSheet}>{upperFirst(name)}</Text>
          </Right>
        </ListItem>

        <WhitePortal name="chartPortal" />

        <ListItem>
          <Left><Text>Last updated</Text></Left>
          <Right flexDirection="row">
            <Text note>{moment(lastTimestamp).fromNow()}</Text>
            {
              isOutdated &&
              <Icon iconRef={this.setOutdatedIcon} icon="warning" size={16} onPress={this.showOutdatedPopover} />
            }
          </Right>
        </ListItem>

        <Popover
          isVisible={this.state.showPopover}
          onClose={this.hidePopover}
          fromRect={this.state.popoverAnchor}
          contentStyle={styles.popoverContent}
        >
          <Text note>{this.state.popoverMessage}</Text>
        </Popover>

        <ActionSheet
          ref={this.setActionSheet}
          title="Gauge information"
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
