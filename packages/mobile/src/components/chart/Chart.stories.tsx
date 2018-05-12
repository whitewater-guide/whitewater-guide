import { storiesOf } from '@storybook/react-native';
import times from 'lodash/times';
import moment from 'moment';
import React from 'react';
import { Gauge, HarvestMode, Unit } from '../../ww-commons';
import Chart from './Chart';

function generateData(days: number, step: number) {
  const count = days * (24 / step);
  return times(count, (i) => ({
    timestamp: moment().subtract(i * step, 'hours').toDate(),
    flow: 100 + (100 * (Math.random() - 0.5)),
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

storiesOf('Chart')
  .add('With empty data', () => (
    <Chart
      loading={false}
      data={[]}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  .add('With daily data', () => (
    <Chart
      loading={false}
      data={daily}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  .add('With weekly data', () => (
    <Chart
      loading={false}
      data={weekly}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  .add('With monthly data', () => (
    <Chart
      loading={false}
      data={monthly}
      unit={Unit.LEVEL}
      gauge={gauge}
    />
  ))
  // .add('With close bindings', () => (
  //   <Chart {...monthly} binding={closeBindings} />
  // ))
  // .add('With distant bindings', () => (
  //   <Chart {...monthly} binding={distantBindings} />
  // ));
