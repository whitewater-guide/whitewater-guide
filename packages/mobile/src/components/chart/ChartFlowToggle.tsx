import React from 'react';
import { translate } from 'react-i18next';
import { Text } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { createAnimatableComponent } from 'react-native-animatable';
import { Paragraph, Subheading } from 'react-native-paper';
import { WithT } from '../../i18n';
import { FlowToggleProps } from '../../ww-clients/features/charts';
import { Unit } from '../../ww-commons/features/measurements';
import { Icon } from '../Icon';
import { Left, Right, Row } from '../Row';

const AnimatableText = createAnimatableComponent(Text);

type Props = FlowToggleProps & WithT;

class ChartFlowToggleInternal extends React.PureComponent<Props> {
  actionSheetOptions: string[];
  pulseKey: number = 0;
  actionSheet: ActionSheet;

  constructor(props: Props) {
    super(props);
    this.actionSheetOptions = [
      props.t('commons:flow'),
      props.t('commons:level'),
      props.t('commons:cancel'),
    ];
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.unit !== nextProps.unit) {
      this.pulseKey += 1;
    }
  }

  onShowActionSheet = () => {
    if (this.actionSheet) {
      this.actionSheet.show();
    }
  };

  onSelect = (index: number) => {
    if (index < 2) {
      this.props.onChange(index ? Unit.LEVEL : Unit.FLOW);
    }
  };

  setActionSheet = (ref: ActionSheet) => {
    this.actionSheet = ref;
  };

  render() {
    const { unitName, unit, enabled, gauge, t } = this.props;
    const value = gauge.lastMeasurement ? gauge.lastMeasurement[unit].toFixed(2) : '?';
    return (
      <Row>
        <Left flexDirection="row">
          <Subheading>{`${t('section:chart.lastRecorded.title')} `}</Subheading>
          <AnimatableText
            key={`txt${this.pulseKey}`}
            animation="fadeIn"
            delay={200}
            useNativeDriver
          >
            {`section:chart.lastRecorded.${unit}`}
          </AnimatableText>
        </Left>
        <Right flexDirection="row">
          <Paragraph>{`${value} ${t('commons:' + unitName)}`}</Paragraph>
          {
            enabled &&
            <Icon primary icon="more" onPress={this.onShowActionSheet} />
          }
          {
            enabled &&
            <ActionSheet
              ref={this.setActionSheet}
              title={t('section:chart.flowToggle')}
              options={this.actionSheetOptions}
              cancelButtonIndex={2}
              onPress={this.onSelect}
            />
          }
        </Right>
      </Row>
    );
  }
}

export const ChartFlowToggle = translate()(ChartFlowToggleInternal);
