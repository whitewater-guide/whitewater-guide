import { Context } from '@apollo';
import { HarvestMode } from '@whitewater-guide/commons';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import compareDesc from 'date-fns/compareDesc';
import differenceInDays from 'date-fns/differenceInDays';
import parseISO from 'date-fns/parseISO';
import {
  SOURCE_ALPS,
  SOURCE_GALICIA_2,
  SOURCE_NORWAY,
} from '../../../seeds/test/05_sources';
import {
  GorgeGauge,
  GorgeJob,
  GorgeMeasurement,
  GorgeScript,
  GorgeStatus,
} from '../types';

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => hoursAgo(24 * days);

const { GorgeConnector: Original } = jest.requireActual('../connector.ts');

export class GorgeConnector extends Original implements DataSource<Context> {
  private _jobs: Map<string, GorgeJob> = new Map<string, GorgeJob>([
    [
      SOURCE_GALICIA_2,
      {
        id: SOURCE_GALICIA_2,
        script: 'galicia2',
        gauges: {},
        cron: '',
      },
    ],
    [
      SOURCE_ALPS,
      {
        id: SOURCE_ALPS,
        script: 'alps',
        gauges: {},
        cron: '10 * * * *',
      },
    ],
    [
      SOURCE_NORWAY,
      {
        id: SOURCE_NORWAY,
        script: 'norway',
        gauges: {},
        cron: '',
      },
    ],
  ]);
  private _measurements: GorgeMeasurement[] = [
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
      timestamp: daysAgo(1),
      flow: 30.1,
      level: 2.5,
    },
    {
      script: 'galicia',
      code: 'gal1',
      timestamp: daysAgo(2),
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
      timestamp: daysAgo(1),
      flow: 66.5,
      level: 45.8,
    },
    {
      script: 'galicia',
      code: 'gal2',
      timestamp: daysAgo(2),
      flow: 80.1,
      level: 49.3,
    },
  ];
  private _gauges: GorgeGauge[] = [
    {
      name: 'Russia gauge 1',
      location: { latitude: 11, longitude: 22, altitude: 33 },
      url: 'http://ww.guide/ru1',
      flowUnit: '',
      levelUnit: 'm',
      code: 'ru1',
      script: 'russia',
    },
    {
      name: 'Russia gauge 2',
      location: { latitude: 44, longitude: 55, altitude: 66 },
      url: 'http://ww.guide/ru2',
      flowUnit: 'm3/s',
      levelUnit: 'm',
      code: 'ru2',
      script: 'russia',
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

  initialize?(config: DataSourceConfig<Context>): void {}

  public async listScripts(): Promise<GorgeScript[]> {
    return Promise.resolve([
      { name: 'all_at_once', mode: HarvestMode.ALL_AT_ONCE },
      { name: 'one_by_one', mode: HarvestMode.ONE_BY_ONE },
    ]);
  }

  public async listGauges(
    script: string,
    requestParams: any,
  ): Promise<GorgeGauge[]> {
    return this._gauges.filter((g) => g.script === script);
  }

  public async listJobs(): Promise<Map<string, GorgeJob>> {
    return Promise.resolve(this._jobs);
  }

  public async getGaugeStatuses(
    sourceId: string,
  ): Promise<Map<string, GorgeStatus>> {
    return Promise.resolve(new Map());
  }

  public async createJob(sourceId: string): Promise<GorgeJob> {
    const fake: GorgeJob = {
      id: sourceId,
      script: 'all_at_once',
      gauges: {},
      cron: '',
    };
    this._jobs.set(sourceId, fake);
    return Promise.resolve(fake);
  }

  public async deleteJobForSource(sourceId: string): Promise<void> {
    this._jobs.delete(sourceId);
    return Promise.resolve();
  }

  public async createJobForSource(
    sourceId: string,
    enabled: boolean,
  ): Promise<boolean> {
    if (enabled) {
      this.createJob(sourceId);
    } else {
      this.deleteJobForSource(sourceId);
    }
    return Promise.resolve(enabled);
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
    days: number,
  ): Promise<GorgeMeasurement[]> {
    return Promise.resolve(
      this._measurements.filter(
        (m) =>
          m.script === script &&
          m.code === code &&
          differenceInDays(new Date(), parseISO(m.timestamp)) <= days,
      ),
    );
  }
}
