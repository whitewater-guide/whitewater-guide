import React from 'react';
import { translate } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { PeriodToggleProps } from '../../ww-clients/features/charts';
import { Body, Row } from '../Row';

class ChartPeriodToggleInternal extends React.PureComponent<PeriodToggleProps & WithT> {
  setDay = () => this.props.onChange(1);
  setWeek = () => this.props.onChange(7);
  setMonth = () => this.props.onChange(31);

  renderLoading = () => (
    <Body>
      <ActivityIndicator color={theme.colors.primary} />
    </Body>
  );

  renderLoaded = () => {
    const { days, t } = this.props;
    const index = days > 10 ? 2 : (days > 2 ? 1 : 0);
    return (
      <Body flexDirection="row">
        <Button primary={index === 0} onPress={this.setDay}>
          {t('section:chart.day')}
        </Button>
        <Button primary={index === 1} onPress={this.setWeek}>
          {t('section:chart.week')}
        </Button>
        <Button primary={index === 2} onPress={this.setMonth}>
          {t('section:chart.month')}
        </Button>
      </Body>
    );
  };

  render() {
    return (
      <Row>
        {this.props.loading ? this.renderLoading() : this.renderLoaded()}
      </Row>
    );
  }
}

export const ChartPeriodToggle = translate()(ChartPeriodToggleInternal);
