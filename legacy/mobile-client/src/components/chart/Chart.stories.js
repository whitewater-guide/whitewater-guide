import React from 'react';
import { storiesOf } from '@kadira/react-native-storybook';
import Chart from './Chart';
import moment from 'moment';
import times from 'lodash/times';

function generateData(days, step) {
  const count = days * (24 / step);
  return {
    domain: [moment().subtract(days, 'days').toDate(), new Date()],
    data: times(count, i => ({
      date: moment().subtract(i * step, 'hours').toDate(),
      flow: 100 + (100 * (Math.random() - 0.5)),
      level: 0.5 + Math.random(),
    })),
  };
}

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
    <Chart data={[]} domain={daily.domain} />
  ))
  .add('With daily data', () => (
    <Chart {...daily} unit={'level'} />
  ))
  .add('With weekly data', () => (
    <Chart {...weekly} unit={'level'} />
  ))
  .add('With monthly data', () => (
    <Chart {...monthly} unit={'level'} />
  ))
  .add('With close bindings', () => (
    <Chart {...monthly} binding={closeBindings} />
  ))
  .add('With distant bindings', () => (
    <Chart {...monthly} binding={distantBindings} />
  ));