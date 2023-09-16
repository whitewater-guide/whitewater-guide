/* eslint-disable import/no-duplicates */
import { formatDistanceToNow, useChart } from '@whitewater-guide/clients';
import { Unit } from '@whitewater-guide/schema';
import differenceInDays from 'date-fns/differenceInDays';
import parseISO from 'date-fns/parseISO';
import upperFirst from 'lodash/upperFirst';
import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';

import { Left, Right, Row } from '~/components/Row';
import theme from '~/theme';

import GaugeWarning from './GaugeValueWarning';
import useGaugeActionSheet from './useGaugeActionSheet';

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'right',
  },
  linkWrapper: {
    flex: 1,
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
  gaugeRow: {
    height: theme.rowHeight,
    paddingVertical: 0,
  },
  gaugeRowRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

const GaugeInfo: FC = () => {
  const { unit, gauge, section } = useChart();
  const approximate =
    unit === Unit.FLOW
      ? section?.flows?.approximate
      : section?.levels?.approximate;
  const formula =
    unit === Unit.FLOW ? section?.flows?.formula : section?.levels?.formula;
  const { name, latestMeasurement } = gauge;

  const { t } = useTranslation();
  const showMenu = useGaugeActionSheet(gauge);

  const isOutdated = latestMeasurement
    ? differenceInDays(new Date(), parseISO(latestMeasurement.timestamp)) > 1
    : false;
  const fromNow = latestMeasurement
    ? formatDistanceToNow(parseISO(latestMeasurement.timestamp), {
        addSuffix: true,
      })
    : '';
  return (
    <>
      <Row style={styles.gaugeRow}>
        <Left>
          <Subheading>
            {approximate || !!formula
              ? t('screens:section.chart.baseGauge')
              : t('commons:gauge')}
          </Subheading>
        </Left>
        <Right row style={styles.gaugeRowRight}>
          {(approximate || !!formula) && (
            <View>
              <GaugeWarning>
                <View style={styles.approximatePopover}>
                  <Paragraph>
                    {formula
                      ? t('screens:section.chart.formulaWarning')
                      : t('screens:section.chart.approximateWarning')}
                  </Paragraph>
                  {formula && (
                    <Paragraph style={styles.formula}>{formula}</Paragraph>
                  )}
                  {formula && (
                    <Paragraph>
                      {t('screens:section.chart.formulaWarning2')}
                      <Text style={styles.x}>{' x '}</Text>
                      {t('screens:section.chart.formulaWarning3')}
                    </Paragraph>
                  )}
                </View>
              </GaugeWarning>
            </View>
          )}
          <View style={styles.linkWrapper}>
            <Paragraph style={styles.link} onPress={showMenu}>
              {upperFirst(name)}
            </Paragraph>
          </View>
        </Right>
      </Row>

      <Row>
        <Left>
          <Subheading>{t('screens:section.chart.lastUpdated')}</Subheading>
        </Left>
        <Right row>
          <Paragraph>{fromNow}</Paragraph>
          {isOutdated && (
            <GaugeWarning>
              <Paragraph>
                {t('screens:section.chart.outdatedWarning')}
              </Paragraph>
            </GaugeWarning>
          )}
        </Right>
      </Row>
    </>
  );
};

export default GaugeInfo;
