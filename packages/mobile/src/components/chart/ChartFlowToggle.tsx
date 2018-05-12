import PropTypes from 'prop-types';
import React from 'react';
import { translate } from 'react-i18next';
import { BlackPortal } from 'react-native-portal';
import ActionSheet from 'react-native-actionsheet';
import { createAnimatableComponent } from 'react-native-animatable';
import { WithT } from '../../i18n';
import { FlowToggleProps } from '../../ww-clients/features/charts';
import { Icon, ListItem, Left, Right, Text } from '../index';

const AnimatableText = createAnimatableComponent(Text);

type Props = FlowToggleProps & WithT;

class ChartFlowToggle extends React.PureComponent<Props> {
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
      this.props.onChange(this.actionSheetOptions[index].toLowerCase());
    }
  };

  setActionSheet = (ref: ActionSheet) => {
    this.actionSheet = ref;
  };

  render() {
    const { unitName, unit, enabled, t } = this.props;
    return (
      <BlackPortal name="chartPortal">
        <ListItem>
          <Left flexDirection="row">
            <Text>{`${t('section:chart.lastRecorded.title')} `}</Text>
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
            <Text note>{`${value.toFixed(2)} ${t('commons:' + unit)}`}</Text>
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
        </ListItem>
      </BlackPortal>
    );
  }
}

export default translate()(ChartFlowToggle);
