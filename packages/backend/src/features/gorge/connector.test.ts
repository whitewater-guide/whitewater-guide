import * as gorge from '@whitewater-guide/gorge';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { holdTransaction, rollbackTransaction } from '~/db';
import { SOURCE_GALICIA_1 } from '~/seeds/test/05_sources';

import { GorgeConnector } from './connector';

const mock = new MockAdapter(axios);

beforeEach(async () => {
  mock.reset();
  await holdTransaction();
});
afterEach(rollbackTransaction);

const ERROR: gorge.ErrorResponse = { status: 'script failed' };

it('should list scripts', async () => {
  const scripts: gorge.ScriptDescriptor[] = [
    { name: 'all_at_once', mode: 0, description: 'All at once' },
    { name: 'one_by_one', mode: 1, description: 'One by one' },
  ];
  mock.onGet(/.*\/scripts/).replyOnce(200, scripts);
  const connector = new GorgeConnector();
  await expect(connector.listScripts()).resolves.toEqual(scripts);
  await expect(connector.listScripts()).resolves.toEqual(scripts);
});

it('should handle list scripts error', async () => {
  mock.onGet(/.*\/scripts/).replyOnce(500, ERROR);
  const connector = new GorgeConnector();
  await expect(connector.listScripts()).rejects.toThrow(ERROR.status);
});

it('should list gauges', async () => {
  const gauges: gorge.Gauge[] = [
    {
      code: 'g000',
      name: 'gauge 0',
      script: 'all_at_once',
      flowUnit: 'm3/s',
      levelUnit: 'm',
      location: {
        latitude: 10,
        longitude: 11,
        altitude: 12,
      },
      url: 'https://whitewater.guide/g000',
    },
  ];
  mock.onPost(/.*\/upstream\/all_at_once\/gauges/).replyOnce(({ data }) => {
    if (JSON.parse(data).gauges === 1) {
      return [200, gauges];
    }
    return [500, { error: 'script failed' }];
  });
  const connector = new GorgeConnector();
  await expect(
    connector.listGauges('all_at_once', { gauges: 1 }),
  ).resolves.toEqual(gauges);
  await expect(
    connector.listGauges('all_at_once', { gauges: 1 }),
  ).resolves.toEqual(gauges);
});

it('should handle list gauges error', async () => {
  mock.onPost(/.*\/upstream\/all_at_once\/gauges/).replyOnce(500, ERROR);
  const connector = new GorgeConnector();
  await expect(
    connector.listGauges('all_at_once', { gauges: 1 }),
  ).rejects.toThrow(ERROR.status);
});

it('should list jobs', async () => {
  const jobs: gorge.JobDescription[] = [
    {
      id: '35964e89-4482-40af-8a15-ad9e7d970212',
      cron: '* * * * *',
      gauges: { g000: {} },
      script: 'all_at_once',
      options: { gauges: 1 },
      status: {
        count: 0,
        success: false,
        timestamp: '2019-01-01',
        error: 'something is broken',
      },
    },
  ];
  const expected = new Map([['35964e89-4482-40af-8a15-ad9e7d970212', jobs[0]]]);
  mock.onGet(/.*\/jobs/).replyOnce(200, jobs);
  const connector = new GorgeConnector();
  await expect(connector.listJobs()).resolves.toEqual(expected);
  await expect(connector.listJobs()).resolves.toEqual(expected);
});

it('should handle list jobs error', async () => {
  mock.onGet(/.*\/jobs/).replyOnce(500, ERROR);
  const connector = new GorgeConnector();
  await expect(connector.listJobs()).rejects.toThrow(ERROR.status);
});

it('should dedupe list jobs calls', async () => {
  const jobs: gorge.JobDescription[] = [
    {
      id: '35964e89-4482-40af-8a15-ad9e7d970212',
      cron: '* * * * *',
      gauges: { g000: {} },
      script: 'all_at_once',
      options: { gauges: 1 },
      status: {
        count: 0,
        success: false,
        timestamp: '2019-01-01',
        error: 'something is broken',
      },
    },
  ];
  const expected = new Map([['35964e89-4482-40af-8a15-ad9e7d970212', jobs[0]]]);
  mock.onGet(/.*\/jobs/).replyOnce(200, jobs);
  const connector = new GorgeConnector();
  await expect(
    Promise.all([connector.listJobs(), connector.listJobs()]),
  ).resolves.toEqual([expected, expected]);
});

it('should get job', async () => {
  const jobs: gorge.JobDescription[] = [
    {
      id: '35964e89-4482-40af-8a15-ad9e7d970212',
      cron: '* * * * *',
      gauges: { g000: {} },
      script: 'all_at_once',
      options: { gauges: 1 },
      status: {
        count: 0,
        success: false,
        timestamp: '2019-01-01',
        error: 'something is broken',
      },
    },
  ];
  mock.onGet(/.*\/jobs/).replyOnce(200, jobs);
  const connector = new GorgeConnector();
  await expect(
    connector.getJobForSource('35964e89-4482-40af-8a15-ad9e7d970212'),
  ).resolves.toEqual(jobs[0]);
  await expect(
    connector.getJobForSource('35964e89-4482-40af-8a15-ad9e7d970212'),
  ).resolves.toEqual(jobs[0]);
});

it('should handle get job error', async () => {
  mock.onGet(/.*\/jobs/).replyOnce(500, ERROR);
  const connector = new GorgeConnector();
  await expect(
    connector.getJobForSource('35964e89-4482-40af-8a15-ad9e7d970212'),
  ).rejects.toThrow(ERROR.status);
});

it('should get gauge statuses', async () => {
  const gauges: Record<string, gorge.Status> = {
    g000: {
      count: 1,
      success: true,
      timestamp: '2019-01-01',
    },
  };
  const expected = new Map([['g000', gauges.g000]]);
  mock
    .onGet(/.*\/jobs\/35964e89-4482-40af-8a15-ad9e7d970212\/gauges/)
    .replyOnce(200, gauges);
  const connector = new GorgeConnector();
  await expect(
    connector.getGaugeStatuses('35964e89-4482-40af-8a15-ad9e7d970212'),
  ).resolves.toEqual(expected);
  await expect(
    connector.getGaugeStatuses('35964e89-4482-40af-8a15-ad9e7d970212'),
  ).resolves.toEqual(expected);
});

it('should handle get gauge statuses error', async () => {
  mock
    .onGet(/.*\/jobs\/35964e89-4482-40af-8a15-ad9e7d970212\/gauges/)
    .replyOnce(500, ERROR);
  const connector = new GorgeConnector();
  await expect(
    connector.getGaugeStatuses('35964e89-4482-40af-8a15-ad9e7d970212'),
  ).rejects.toThrow(ERROR.status);
});

it('should delete job', async () => {
  mock
    .onDelete(/.*\/jobs\/35964e89-4482-40af-8a15-ad9e7d970212/)
    .replyOnce(200, { success: true });
  const connector = new GorgeConnector();
  await expect(
    connector.deleteJobForSource('35964e89-4482-40af-8a15-ad9e7d970212'),
  ).resolves.not.toThrow();
});

it('should handle delete job error', async () => {
  mock
    .onDelete(/.*\/jobs\/35964e89-4482-40af-8a15-ad9e7d970212/)
    .replyOnce(500, ERROR);
  const connector = new GorgeConnector();
  await expect(
    connector.deleteJobForSource('35964e89-4482-40af-8a15-ad9e7d970212'),
  ).rejects.toThrow(ERROR.status);
});

it('should get measurements', async () => {
  const measurements: gorge.Measurement[] = [
    {
      script: 'one_by_one',
      code: 'g000',
      timestamp: '2018-01-01',
      flow: null,
      level: 121,
    },
  ];
  mock
    .onGet(new RegExp('.*/measurements/one_by_one/g000\\?from=.*$'))
    .replyOnce(200, measurements);
  const connector = new GorgeConnector();
  await expect(
    connector.getMeasurements('one_by_one', 'g000', {
      from: new Date(2018, 1, 1),
    }),
  ).resolves.toEqual(measurements);
});

it('should handle get measurements error', async () => {
  mock
    .onGet(new RegExp('.*/measurements/one_by_one/g000\\?from=.*$'))
    .replyOnce(500, ERROR);
  const connector = new GorgeConnector();
  await expect(
    connector.getMeasurements('one_by_one', 'g000', {
      from: new Date(2018, 1, 1),
    }),
  ).rejects.toThrow(ERROR.status);
});

describe('create job', () => {
  const job: gorge.JobDescription = {
    id: SOURCE_GALICIA_1,
    cron: '0 * * * *',
    gauges: { gal1: { foo: 'bar' } },
    script: 'galicia',
    options: {},
  };

  it('should create job', async () => {
    mock.onPost(/.*\/jobs/).replyOnce(200, job);
    mock.onGet(/.*\/jobs/).replyOnce(200, []);
    const connector = new GorgeConnector();
    await expect(
      connector.createJobForSource(SOURCE_GALICIA_1),
    ).resolves.toEqual(job);
  });

  it('should re-create job', async () => {
    mock.onPost(/.*\/jobs/).replyOnce(200, job);
    mock.onGet(/.*\/jobs/).replyOnce(200, [job]);
    mock
      .onDelete(new RegExp(`.*/jobs/${SOURCE_GALICIA_1}`))
      .replyOnce(200, { success: true });
    const connector = new GorgeConnector();
    await expect(
      connector.createJobForSource(SOURCE_GALICIA_1),
    ).resolves.toEqual(job);
  });

  it('should fail if source does not exist', async () => {
    const badId = '9964317f-1068-4523-8969-913a36c2b336';
    const connector = new GorgeConnector();
    await expect(connector.createJobForSource(badId)).rejects.toThrowError(
      /not\sfound/,
    );
  });

  it('should handle creation error job', async () => {
    mock.onPost(/.*\/jobs/).replyOnce(500, ERROR);
    mock.onGet(/.*\/jobs/).replyOnce(200, []);
    const connector = new GorgeConnector();
    await expect(
      connector.createJobForSource(SOURCE_GALICIA_1),
    ).rejects.toThrow(ERROR.status);
  });
});

describe('toggle job', () => {
  const job: gorge.JobDescription = {
    id: SOURCE_GALICIA_1,
    cron: '0 * * * *',
    gauges: { gal1: { foo: 'bar' } },
    script: 'galicia',
    options: {},
  };

  it('should enable enabled source without calls', async () => {
    mock.onGet(/.*\/jobs/).replyOnce(200, [job]);
    const connector = new GorgeConnector();
    await expect(
      connector.toggleJobForSource(SOURCE_GALICIA_1, true),
    ).resolves.toEqual(true);
    expect(mock.history.post).toHaveLength(0);
    expect(mock.history.delete).toHaveLength(0);
    await expect(connector.isSourceEnabled(SOURCE_GALICIA_1)).resolves.toEqual(
      true,
    );
  });

  it('should disable enabled source', async () => {
    mock.onGet(/.*\/jobs/).replyOnce(200, [job]);
    mock
      .onDelete(new RegExp(`.*/jobs/${SOURCE_GALICIA_1}`))
      .replyOnce(200, { success: true });
    const connector = new GorgeConnector();
    await expect(
      connector.toggleJobForSource(SOURCE_GALICIA_1, false),
    ).resolves.toEqual(false);
    expect(mock.history.post).toHaveLength(0);
    expect(mock.history.delete).toHaveLength(1);
    await expect(connector.isSourceEnabled(SOURCE_GALICIA_1)).resolves.toEqual(
      false,
    );
  });

  it('should enable disabled source', async () => {
    mock.onGet(/.*\/jobs/).replyOnce(200, []);
    mock.onPost(/.*\/jobs/).replyOnce(200, job);
    const connector = new GorgeConnector();
    await expect(
      connector.toggleJobForSource(SOURCE_GALICIA_1, true),
    ).resolves.toEqual(true);
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.delete).toHaveLength(0);
    await expect(connector.isSourceEnabled(SOURCE_GALICIA_1)).resolves.toEqual(
      true,
    );
  });

  it('should disable disabled source without network calls', async () => {
    mock.onGet(/.*\/jobs/).replyOnce(200, []);
    const connector = new GorgeConnector();
    await expect(
      connector.toggleJobForSource(SOURCE_GALICIA_1, false),
    ).resolves.toEqual(false);
    expect(mock.history.post).toHaveLength(0);
    expect(mock.history.delete).toHaveLength(0);
    await expect(connector.isSourceEnabled(SOURCE_GALICIA_1)).resolves.toEqual(
      false,
    );
  });
});

describe('latest', () => {
  it('should get latest measurement for single gauge', async () => {
    const measurements: gorge.Measurement[] = [
      {
        script: 'one_by_one',
        code: 'g000',
        timestamp: '2018-01-01',
        flow: null,
        level: 121,
      },
    ];
    mock
      .onGet(new RegExp('.*/measurements/one_by_one/g000/latest'))
      .replyOnce(200, measurements);
    const connector = new GorgeConnector();
    await expect(connector.getLatest('one_by_one', 'g000')).resolves.toEqual(
      measurements[0],
    );
  });

  it('should get latest measurements for multiple sources', async () => {
    const measurements: gorge.Measurement[] = [
      {
        script: 'one_by_one',
        code: 'o000',
        timestamp: '2018-01-01',
        flow: null,
        level: 121,
      },
      {
        script: 'one_by_one',
        code: 'o001',
        timestamp: '2018-01-01',
        flow: null,
        level: 1,
      },
      {
        script: 'all_at_once',
        code: 'a000',
        timestamp: '2019-01-01',
        flow: null,
        level: 111,
      },
    ];
    mock
      .onGet(
        new RegExp('.*/measurements/latest\\?scripts=one_by_one,all_at_once'),
      )
      .replyOnce(200, measurements);
    const connector = new GorgeConnector();
    await expect(
      Promise.all([
        connector.getLatest('one_by_one', 'o000'),
        connector.getLatest('one_by_one', 'o001'),
        connector.getLatest('all_at_once', 'a000'),
      ]),
    ).resolves.toEqual(measurements);
  });

  it('should handle get latest measurements error', async () => {
    mock
      .onGet(
        new RegExp('.*/measurements/latest\\?scripts=one_by_one,all_at_once'),
      )
      .replyOnce(500, ERROR);
    const connector = new GorgeConnector();
    await expect(
      Promise.all([
        connector.getLatest('one_by_one', 'o000'),
        connector.getLatest('all_at_once', 'a000'),
      ]),
    ).rejects.toThrow(ERROR.status);
  });

  it('should handle empty latest measurements', async () => {
    const measurements: gorge.Measurement[] = [
      {
        script: 'one_by_one',
        code: 'o000',
        timestamp: '2018-01-01',
        flow: null,
        level: 121,
      },
    ];
    mock
      .onGet(
        new RegExp('.*/measurements/latest\\?scripts=one_by_one,all_at_once'),
      )
      .replyOnce(200, measurements);
    const connector = new GorgeConnector();
    await expect(
      Promise.all([
        connector.getLatest('one_by_one', 'o000'),
        connector.getLatest('one_by_one', 'o001'),
        connector.getLatest('all_at_once', 'a000'),
      ]),
    ).resolves.toEqual([...measurements, null, null]);
  });
});
