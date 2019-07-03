import { Gauge } from '@whitewater-guide/commons';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Paragraph, Subheading } from 'react-native-paper';
import { Left, Right, Row } from '../../../components';
import theme from '../../../theme';
import GaugeWarning from './GaugeValueWarning';
import useGaugeActionSheet from './useGaugeActionSheet';

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  approximatePopover: {
    width: theme.screenWidth * 0.66,
  },
  formula: {
    fontWeight: 'bold',
    alignSelf: 'stretch',
    alignItems: 'center',
    textAlign: 'center',
  },
  x: {
    fontWeight: 'bold',
  },
});

interface Props {
  gauge: Gauge;
  approximate: boolean;
  formula?: string | null;
}

const GaugeInfo: React.FC<Props> = (props) => {
  const { gauge, approximate, formula } = props;
  const { name, lastMeasurement } = gauge;

  const { t } = useTranslation();
  const [sheet, showSheet, sheetProps] = useGaugeActionSheet(gauge);

  const isOutdated = lastMeasurement
    ? moment().diff(lastMeasurement.timestamp, 'days') > 1
    : false;
  return (
    <React.Fragment>
      <Row>
        <Left>
          <Subheading>
            {approximate || !!formula
              ? t('section:chart.baseGauge')
              : t('commons:gauge')}
          </Subheading>
        </Left>
        <Right row={true}>
          {(approximate || !!formula) && (
            <GaugeWarning>
              <View style={styles.approximatePopover}>
                <Paragraph>
                  {formula
                    ? t('section:chart.formulaWarning')
                    : t('section:chart.approximateWarning')}
                </Paragraph>
                {formula && (
                  <Paragraph style={styles.formula}>{formula}</Paragraph>
                )}
                {formula && (
                  <Paragraph>
                    {t('section:chart.formulaWarning2')}
                    <Text style={styles.x}>{' x '}</Text>
                    {t('section:chart.formulaWarning3')}
                  </Paragraph>
                )}
              </View>
            </GaugeWarning>
          )}
          <Paragraph style={styles.link} onPress={showSheet} numberOfLines={1}>
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
            {lastMeasurement ? moment(lastMeasurement.timestamp).fromNow() : ''}
          </Paragraph>
          {isOutdated && (
            <GaugeWarning>
              <Paragraph>{t('section:chart.outdatedWarning')}</Paragraph>
            </GaugeWarning>
          )}
        </Right>
      </Row>

      <ActionSheet
        ref={sheet}
        title={t('section:chart.gaugeMenu.title')}
        cancelButtonIndex={2}
        {...sheetProps}
      />
    </React.Fragment>
  );
};

export default GaugeInfo;
