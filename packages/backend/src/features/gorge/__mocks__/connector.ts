/* eslint-disable import/no-duplicates */
import { MeasurementsFilter } from '@whitewater-guide/commons';
import * as gorge from '@whitewater-guide/gorge';
import { DataSource } from 'apollo-datasource';
import compareDesc from 'date-fns/compareDesc';
import parseISO from 'date-fns/parseISO';

import { Context } from '~/apollo';

import {
  SOURCE_ALPS,
  SOURCE_GALICIA_1,
  SOURCE_GALICIA_2,
  SOURCE_NORWAY,
} from '../../../seeds/test/05_sources';

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const almostDaysAgo = (days: number) => hoursAgo(24 * days - 1);

const { GorgeConnector: Original } = jest.requireActual('../connector.ts');

export const mockUpdateJobForSource = jest.fn();

export class GorgeConnector extends Original implements DataSource<Context> {
  private _jobs: Map<string, gorge.JobDescription> = new Map<
    string,
    gorge.JobDescription
  >([
    [
      SOURCE_GALICIA_1,
      {
        id: SOURCE_GALICIA_1,
        script: 'galicia',
        gauges: {},
        cron: '',
        options: {},
      },
    ],
    [
      SOURCE_GALICIA_2,
      {
        id: SOURCE_GALICIA_2,
        script: 'galicia2',
        gauges: {},
        cron: '',
        options: {},
      },
    ],
    [
      SOURCE_ALPS,
      {
        id: SOURCE_ALPS,
        script: 'alps',
        gauges: {},
        cron: '10 * * * *',
        options: {},
      },
    ],
    [
      SOURCE_NORWAY,
      {
        id: SOURCE_NORWAY,
        script: 'norway',
        gauges: {},
        cron: '',
        options: {},
      },
    ],
  ]);
  private _measurements: gorge.Measurement[] = [
    {
      script: 'galicia',
      code: 'gal1',
      timestamp: hoursAgo(1),
      flow: null,
      level: 1.2,
    },
    {
      script: 'galicia',
      code: 'gal1',
      timestamp: hoursAgo(2),
      flow: 10.1,
      level: 1.3,
    },
    {
      script: 'galicia',
      code: 'gal1',
      timestamp: hoursAgo(3),
      flow: 10.1,
      level: null,
    },
    {
      script: 'galicia',
      code: 'gal1',
      timestamp: almostDaysAgo(1),
      flow: 30.1,
      level: 2.5,
    },
    {
      script: 'galicia',
      code: 'gal1',
      timestamp: almostDaysAgo(2),
      flow: 33.1,
      level: 2.9,
    },
    {
      script: 'galicia',
      code: 'gal2',
      timestamp: hoursAgo(1),
      flow: 22,
      level: 33,
    },
    {
      script: 'galicia',
      code: 'gal2',
      timestamp: hoursAgo(2),
      flow: 22.1,
      level: 33.3,
    },
    {
      script: 'galicia',
      code: 'gal2',
      timestamp: hoursAgo(3),
      flow: 22.9,
      level: 35.6,
    },
    {
      script: 'galicia',
      code: 'gal2',
      timestamp: almostDaysAgo(1),
      flow: 66.5,
      level: 45.8,
    },
    {
      script: 'galicia',
      code: 'gal2',
      timestamp: almostDaysAgo(2),
      flow: 80.1,
      level: 49.3,
    },
  ];
  private _gauges: gorge.Gauge[] = [
    {
      name: 'Empty gauge 1',
      location: { latitude: 11, longitude: 22, altitude: 33 },
      url: 'http://ww.guide/empty1',
      flowUnit: '',
      levelUnit: 'm',
      code: 'em1',
      script: 'empty',
    },
    {
      name: 'Empty gauge 2',
      location: { latitude: 44, longitude: 55, altitude: 66 },
      url: 'http://ww.guide/empty2',
      flowUnit: 'm3/s',
      levelUnit: 'm',
      code: 'em2',
      script: 'empty',
    },
    {
      name: 'Galicia GAUGE 1',
      location: { latitude: 11, longitude: 22, altitude: 33 },
      url: 'http://ww.guide/gal1',
      flowUnit: '',
      levelUnit: 'm',
      code: 'gal1',
      script: 'galicia',
    },
    {
      name: 'Galicia gauge 3',
      location: { latitude: 33, longitude: 44, altitude: 55 },
      url: 'http://ww.guide/gal3',
      flowUnit: '',
      levelUnit: 'm',
      code: 'gal3',
      script: 'galicia',
    },
  ];

  initialize?(): void {}

  public async listScripts(): Promise<gorge.ScriptDescriptor[]> {
    return Promise.resolve([
      { name: 'all_at_once', mode: 0, description: 'All at once' },
      { name: 'one_by_one', mode: 1, description: 'One by one' },
    ]);
  }

  public async listGauges(script: string): Promise<gorge.Gauge[]> {
    return this._gauges.filter((g) => g.script === script);
  }

  public async listJobs(): Promise<Map<string, gorge.JobDescription>> {
    return Promise.resolve(this._jobs);
  }

  public async getGaugeStatuses(): Promise<Map<string, gorge.Status>> {
    return Promise.resolve(new Map());
  }

  public async deleteJobForSource(sourceId: string): Promise<void> {
    if (!this._jobs.has(sourceId)) {
      throw new Error('gorge server throws in this case');
    }
    this._jobs.delete(sourceId);
    return Promise.resolve();
  }

  public async createJobForSource(
    sourceId: string,
  ): Promise<gorge.JobDescription> {
    const fake: gorge.JobDescription = {
      id: sourceId,
      script: 'all_at_once',
      gauges: {},
      cron: '',
      options: {},
    };
    this._jobs.set(sourceId, fake);
    return Promise.resolve(fake);
  }

  public async updateJobForSource(sourceId: string) {
    mockUpdateJobForSource(sourceId);
    return super.updateJobForSource(sourceId);
  }

  public getLatest(script: string, code: string) {
    const sorted = this._measurements
      .filter((m) => m.script === script && m.code === code)
      .sort((a, b) =>
        compareDesc(parseISO(a.timestamp), parseISO(b.timestamp)),
      );
    return sorted.length ? sorted[0] : null;
  }

  public async getMeasurements(
    script: string,
    code: string,
    filter: MeasurementsFilter<Date>,
  ): Promise<gorge.Measurement[]> {
    const { from, to } = filter;
    return Promise.resolve(
      this._measurements.filter((m) => {
        const ts = parseISO(m.timestamp);
        return (
          m.script === script &&
          m.code === code &&
          (!from || ts >= from) &&
          (!to || ts <= to)
        );
      }),
    );
  }
}
