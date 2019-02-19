import { FlowToggleProps } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/commons';
import React from 'react';
import { WithI18n, withI18n } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as Animatable from 'react-native-animatable';
import { Paragraph, Subheading } from 'react-native-paper';
import { Icon } from '../Icon';
import { Left, Right, Row } from '../Row';

const styles = StyleSheet.create({
  text: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 2,
  },
});

type Props = FlowToggleProps & WithI18n;

class ChartFlowToggleInternal extends React.PureComponent<Props> {
  _actionSheetOptions: string[];
  _pulseKey: number = 0;
  _actionSheet: ActionSheet | null = null;

  constructor(props: Props) {
    super(props);
    this._actionSheetOptions = [
      props.t('commons:flow'),
      props.t('commons:level'),
      props.t('commons:cancel'),
    ];
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.unit !== nextProps.unit) {
      this._pulseKey += 1;
    }
  }

  onShowActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show();
    }
  };

  onSelect = (index: number) => {
    if (index < 2) {
      this.props.onChange(index ? Unit.LEVEL : Unit.FLOW);
    }
  };

  setActionSheet = (ref: ActionSheet | null) => {
    this._actionSheet = ref;
  };

  renderUnit = () => {
    const { t, unit } = this.props;
    if (this._pulseKey) {
      return (
        <Animatable.Text
          key={`txt${this._pulseKey}`}
          animation="fadeIn"
          delay={200}
          style={styles.text}
        >
          {t(`section:chart.lastRecorded.${unit}`)}
        </Animatable.Text>
      );
    } else {
      return (
        <Text style={styles.text}>
          {t(`section:chart.lastRecorded.${unit}`)}
        </Text>
      );
    }
  };

  render() {
    const { unitName, unit, enabled, gauge, t } = this.props;
    const value = gauge.lastMeasurement
      ? gauge.lastMeasurement[unit].toFixed(2)
      : '?';
    return (
      <Row>
        <Left row={true}>
          <Subheading>{`${t('section:chart.lastRecorded.title')} `}</Subheading>
          {this.renderUnit()}
        </Left>
        <Right row={true}>
          <Paragraph>{`${value} ${t('commons:' + unitName)}`}</Paragraph>
          {enabled && (
            <Icon
              primary={true}
              icon="dots-vertical"
              onPress={this.onShowActionSheet}
            />
          )}
          {enabled && (
            <ActionSheet
              ref={this.setActionSheet}
              title={t('section:chart.flowToggle')}
              options={this._actionSheetOptions}
              cancelButtonIndex={2}
              onPress={this.onSelect}
            />
          )}
        </Right>
      </Row>
    );
  }
}

export const ChartFlowToggle = withI18n()(ChartFlowToggleInternal);
