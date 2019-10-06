import { useChart } from '@whitewater-guide/clients';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Paragraph, Subheading } from 'react-native-paper';
import theme from '../../theme';
import { Left, Right, Row } from '../Row';
import useActionSheet from '../useActionSheet';

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});

const DAYS = [1, 7, 31];

export const ChartPeriodToggle: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [actionSheet, showActionSheet] = useActionSheet();
  const {
    measurements: { loading },
    days,
    onChangeDays,
  } = useChart();
  const onSelect = useCallback(
    (i: number) => {
      if (i < 3) {
        onChangeDays(DAYS[i]);
      }
    },
    [onChangeDays],
  );
  const options = useMemo(
    () => [
      t('section:chart.periodToggle.day'),
      t('section:chart.periodToggle.week'),
      t('section:chart.periodToggle.month'),
      t('commons:cancel'),
    ],
    [t],
  );
  if (loading) {
    return <Row />;
  }
  const index = days > 10 ? 'month' : days > 2 ? 'week' : 'day';
  return (
    <Row>
      <Left row={true}>
        <Subheading>{t('section:chart.periodToggle.title')}</Subheading>
      </Left>
      <Right row={true}>
        <Paragraph style={styles.link} onPress={showActionSheet}>
          {t(`section:chart.periodToggle.${index}`)}
        </Paragraph>
      </Right>
      <ActionSheet
        ref={actionSheet}
        title={t('section:chart.periodToggle.title')}
        options={options}
        cancelButtonIndex={3}
        onPress={onSelect}
      />
    </Row>
  );
});

ChartPeriodToggle.displayName = 'ChartPeriodToggle';
