import PropTypes from 'prop-types';
import React from 'react';
import { BlackPortal } from 'react-native-portal';
import ActionSheet from 'react-native-actionsheet';
import { createAnimatableComponent } from 'react-native-animatable';
import { Icon, ListItem, Left, Right, Text } from '../index';
import I18n from '../../i18n';

const AnimatableText = createAnimatableComponent(Text);

const OPTIONS = [I18n.t('commons.flow'), I18n.t('commons.level'), I18n.t('commons.cancel')];

class ChartFlowToggle extends React.PureComponent {
  static propTypes = {
    measurement: PropTypes.oneOf(['flow', 'level']).isRequired,
    unit: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._actionSheet = null;
    this._pulseKey = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.measurement !== nextProps.measurement) {
      this._pulseKey += 1;
    }
  }

  onShowActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show();
    }
  };

  onSelect = (index) => {
    if (index < 2) {
      this.props.onChange(OPTIONS[index].toLowerCase());
    }
  };

  setActionSheet = (ref) => {
    this._actionSheet = ref;
  };

  render() {
    const { measurement, value, unit, enabled } = this.props;
    return (
      <BlackPortal name="chartPortal">
        <ListItem>
          <Left flexDirection="row">
            <Text>{`${I18n.t('section.chart.lastRecorded.title')} `}</Text>
            <AnimatableText
              key={`txt${this._pulseKey}`}
              animation="fadeIn"
              delay={200}
              useNativeDriver
            >
              {I18n.t('section.chart.lastRecorded.'+measurement)}
            </AnimatableText>
          </Left>
          <Right flexDirection="row">
            <Text note>{`${value.toFixed(2)} ${I18n.t('commons.' + unit)}`}</Text>
            {
              enabled &&
              <Icon primary icon="more" onPress={this.onShowActionSheet} />
            }
            {
              enabled &&
              <ActionSheet
                ref={this.setActionSheet}
                title={I18n.t('section.chart.flowToggle')}
                options={OPTIONS}
                cancelButtonIndex={2}
                onPress={this.onSelect}
              />
            }
          </Right>
        </ListItem>
      </BlackPortal>
    );
  }
}


export default ChartFlowToggle;
