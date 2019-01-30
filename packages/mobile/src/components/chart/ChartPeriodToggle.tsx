import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { ActivityIndicator, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Paragraph, Subheading } from 'react-native-paper';
import theme from '../../theme';
import { PeriodToggleProps } from '@whitewater-guide/clients';
import { Body, Left, Right, Row } from '../Row';

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

type Props = PeriodToggleProps & WithI18n;

class ChartPeriodToggleInternal extends React.PureComponent<Props> {
  _actionSheet: ActionSheet | null = null;
  _actionSheetOptions: string[];

  constructor(props: Props) {
    super(props);
    this._actionSheetOptions = [
      props.t('section:chart.periodToggle.day'),
      props.t('section:chart.periodToggle.week'),
      props.t('section:chart.periodToggle.month'),
      props.t('commons:cancel'),
    ];
  }

  onShowActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show();
    }
  };

  onSelect = (index: number) => {
    const days = [1, 7, 31];
    if (index < 3) {
      this.props.onChange(days[index]);
    }
  };

  setActionSheet = (ref: ActionSheet | null) => {
    this._actionSheet = ref;
  };

  renderLoaded = () => {
    const { days, t } = this.props;
    const index = days > 10 ? 'month' : days > 2 ? 'week' : 'day';
    return (
      <Row>
        <Left flexDirection="row">
          <Subheading>{t('section:chart.periodToggle.title')}</Subheading>
        </Left>
        <Right flexDirection="row">
          <Paragraph style={styles.link} onPress={this.onShowActionSheet}>
            {t(`section:chart.periodToggle.${index}`)}
          </Paragraph>
        </Right>
        <ActionSheet
          ref={this.setActionSheet}
          title={t('section:chart.periodToggle.title')}
          options={this._actionSheetOptions}
          cancelButtonIndex={3}
          onPress={this.onSelect}
        />
      </Row>
    );
  };

  renderLoading = () => (
    <Row>
      <Body>
        <ActivityIndicator color={theme.colors.primary} />
      </Body>
    </Row>
  );

  render() {
    return this.props.loading ? this.renderLoading() : this.renderLoaded();
  }
}

export const ChartPeriodToggle = withI18n()(ChartPeriodToggleInternal);
