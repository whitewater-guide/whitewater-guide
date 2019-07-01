import { storiesOf } from '@storybook/react-native';
import {
  Gauge,
  HarvestMode,
  Measurement,
  Unit,
} from '@whitewater-guide/commons';
import times from 'lodash/times';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PureChart from './PureChart';

function generateData(days: number, step: number): Measurement[] {
  const count = days * (24 / step);
  return times(count, (i) => ({
    timestamp: moment()
      .subtract(i * step, 'hours')
      .toDate(),
    flow: 100 + 100 * (Math.random() - 0.5),
    level: 0.5 + Math.random(),
  }));
}

const gauge: Gauge = {
  id: '111',
  code: 'a111',
  name: 'Test Gauge',
  levelUnit: 'cm',
  flowUnit: 'm3/s',
  cron: null,
  url: 'http://ya.ru',
  enabled: true,
  location: null,
  lastMeasurement: null,
  status: null,
  requestParams: null,
  source: {
    id: 's1',
    name: 'source',
    cron: null,
    enabled: true,
    harvestMode: HarvestMode.ALL_AT_ONCE,
    script: 'test',
    status: null,
    termsOfUse: null,
    url: 'http://yandex.ru',
    createdAt: '2017-01-01',
    updatedAt: '2017-01-01',
    requestParams: null,
  },
  createdAt: '2017-01-01',
  updatedAt: '2017-01-01',
};

const closeBindings = {
  minimum: 10,
  maximum: 120,
  optimum: 80,
  impossible: 155,
};

const distantBindings = {
  minimum: 1,
  maximum: 800,
  optimum: 300,
  impossible: 2000,
};

const daily = generateData(1, 1);
const weekly = generateData(7, 4);
const monthly = generateData(31, 12);

storiesOf('Chart', module)
  .addDecorator((story: any) => (
    <View style={StyleSheet.absoluteFill}>{story()}</View>
  ))
  .add('With empty data', () => (
    <PureChart
      days={1}
      loading={false}
      data={[]}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  .add('Loading', () => (
    <PureChart
      days={1}
      loading={true}
      data={daily}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  .add('With daily data', () => (
    <PureChart
      days={1}
      loading={false}
      data={daily}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  .add('With weekly data', () => (
    <PureChart
      days={7}
      loading={false}
      data={weekly}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  .add('With monthly data', () => (
    <PureChart
      days={31}
      loading={false}
      data={monthly}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  .add('With close bindings', () => (
    <PureChart
      days={7}
      loading={false}
      data={weekly}
      unit={Unit.FLOW}
      gauge={gauge}
      section={{ flows: closeBindings } as any}
    />
  ))
  .add('With distant bindings', () => (
    <PureChart
      loading={false}
      days={7}
      data={weekly}
      unit={Unit.FLOW}
      gauge={gauge}
      section={{ flows: distantBindings } as any}
    />
  ));
