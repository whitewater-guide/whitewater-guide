import { storiesOf } from '@storybook/react-native';
import { Gauge } from '@whitewater-guide/commons';
import subDays from 'date-fns/subDays';
import React from 'react';
import { View } from 'react-native';
import theme from '../../../theme';
import GaugeInfo from './GaugeInfo';

storiesOf('Gauge Info', module)
  .addDecorator((story: any) => (
    <View>
      <View style={{ height: 48, backgroundColor: theme.colors.border }} />
      {story()}
    </View>
  ))
  .add('Fresh value', () => {
    const gauge: Partial<Gauge> = {
      name: 'Some cool gauge',
      latestMeasurement: {
        level: 123,
        flow: 456,
        timestamp: new Date().toISOString(),
      },
    };
    return <GaugeInfo gauge={gauge as any} approximate={false} />;
  })
  .add('Fresh approximate value', () => {
    const gauge: Partial<Gauge> = {
      name: 'Some cool gauge',
      latestMeasurement: {
        level: 123,
        flow: 456,
        timestamp: new Date().toISOString(),
      },
    };
    return <GaugeInfo gauge={gauge as any} approximate={true} />;
  })
  .add('Fresh formula value', () => {
    const gauge: Partial<Gauge> = {
      name: 'Some cool gauge',
      latestMeasurement: {
        level: 123,
        flow: 456,
        timestamp: new Date().toISOString(),
      },
    };
    return (
      <GaugeInfo
        gauge={gauge as any}
        approximate={false}
        formula="(x + 10) * 2"
      />
    );
  })
  .add('Old value', () => {
    const gauge: Partial<Gauge> = {
      name: 'Some cool gauge',
      latestMeasurement: {
        level: 123,
        flow: 456,
        timestamp: subDays(new Date(), 3).toISOString(),
      },
    };
    return <GaugeInfo gauge={gauge as any} approximate={false} />;
  })
  .add('Old approximate value', () => {
    const gauge: Partial<Gauge> = {
      name: 'Some cool gauge',
      latestMeasurement: {
        level: 123,
        flow: 456,
        timestamp: subDays(new Date(), 3).toISOString(),
      },
    };
    return <GaugeInfo gauge={gauge as any} approximate={true} />;
  })
  .add('Old formula value', () => {
    const gauge: Partial<Gauge> = {
      name: 'Gauge',
      latestMeasurement: {
        level: 123,
        flow: 456,
        timestamp: subDays(new Date(), 3).toISOString(),
      },
    };
    return (
      <GaugeInfo
        gauge={gauge as any}
        approximate={false}
        formula="(x + 10) * 2"
      />
    );
  });
