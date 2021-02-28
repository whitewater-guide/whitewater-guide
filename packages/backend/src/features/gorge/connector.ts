import { MeasurementsFilter } from '@whitewater-guide/commons';
import * as gorge from '@whitewater-guide/gorge';
import { DataSource } from 'apollo-datasource';
import Axios, { AxiosResponse } from 'axios';
import DataLoader from 'dataloader';
import { stringify } from 'querystring';

import { Context } from '~/apollo';
import config from '~/config';
import db from '~/db';

const GORGE_HOST = config.GORGE_HOST;
const GORGE_PORT = config.GORGE_PORT;
const GORGE_PATH = '';
const GORGE_URL = `http://${GORGE_HOST}:${GORGE_PORT}${GORGE_PATH}`;

interface Key {
  script: string;
  code: string;
}

const DLOptions: DataLoader.Options<Key, gorge.Measurement, string> = {
  cacheKeyFn: ({ script, code }: Key) => `${script}:${code}`,
};

export class GorgeConnector implements DataSource<Context> {
  private _scripts?: gorge.ScriptDescriptor[];
  private _gauges?: gorge.Gauge[];
  private _gaugeStatuses?: Map<string, Map<string, gorge.Status>>;
  private _jobs?: Map<string, gorge.JobDescription>;
  private _jobsPromise?: Promise<AxiosResponse<gorge.JobDescription[]>>;
  private readonly _latest: DataLoader<Key, gorge.Measurement | null>;

  constructor() {
    this._loadLatestBatch = this._loadLatestBatch.bind(this);
    this._latest = new DataLoader<Key, gorge.Measurement | null, string>(
      this._loadLatestBatch,
      DLOptions,
    );
  }

  initialize() {
    // no-op
  }

  private _handleError(err: any): Error {
    if (err.response) {
      return new Error(err.response?.data?.status);
    }
    return err;
  }

  public async listScripts(): Promise<gorge.ScriptDescriptor[]> {
    try {
      if (!this._scripts) {
        const resp = await Axios.get<gorge.ScriptDescriptor[]>(
          `${GORGE_URL}/scripts`,
        );
        this._scripts = resp.data;
      }
    } catch (err) {
      throw this._handleError(err);
    }
    return this._scripts || [];
  }

  public async listGauges(
    script: string,
    requestParams: any,
  ): Promise<gorge.Gauge[]> {
    try {
      if (!this._gauges) {
        const resp = await Axios.post<gorge.Gauge[]>(
          `${GORGE_URL}/upstream/${script}/gauges`,
          requestParams,
        );
        this._gauges = resp.data;
      }
    } catch (err) {
      throw this._handleError(err);
    }
    return this._gauges || [];
  }

  public async listJobs(): Promise<Map<string, gorge.JobDescription>> {
    try {
      if (!this._jobs) {
        if (!this._jobsPromise) {
          this._jobsPromise = Axios.get<gorge.JobDescription[]>(
            `${GORGE_URL}/jobs`,
          );
        }
        const resp = await this._jobsPromise;
        this._jobs = new Map(resp.data.map((j) => [j.id, j]));
      }
    } catch (err) {
      throw this._handleError(err);
    }
    return this._jobs || new Map();
  }

  public async getJobForSource(
    sourceId: string,
  ): Promise<gorge.JobDescription | undefined> {
    const jobs = await this.listJobs();
    return jobs.get(sourceId);
  }

  public async isSourceEnabled(sourceId: string): Promise<boolean> {
    const job = await this.getJobForSource(sourceId);
    return !!job;
  }

  public async getGaugeStatuses(
    sourceId: string,
  ): Promise<Map<string, gorge.Status>> {
    try {
      if (!this._gaugeStatuses) {
        this._gaugeStatuses = new Map();
      }
      let sourceMap = this._gaugeStatuses.get(sourceId);
      if (!sourceMap) {
        const resp = await Axios.get<Record<string, gorge.Status>>(
          `${GORGE_URL}/jobs/${sourceId}/gauges`,
        );
        sourceMap = new Map();
        for (const gaugeId in resp.data) {
          sourceMap.set(gaugeId, resp.data[gaugeId]);
        }
        this._gaugeStatuses.set(sourceId, sourceMap);
      }
      return sourceMap;
    } catch (err) {
      throw this._handleError(err);
    }
  }

  public async deleteJobForSource(sourceId: string): Promise<void> {
    try {
      await Axios.delete(`${GORGE_URL}/jobs/${sourceId}`);
      this._jobs?.delete(sourceId);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  public async createJobForSource(
    sourceId: string,
  ): Promise<gorge.JobDescription> {
    const input: gorge.JobDescription = await db()
      .select('*')
      .from('jobs_view')
      .where({ id: sourceId })
      .first();
    if (!input) {
      throw new Error(`source ${sourceId} not found`);
    }
    const enabled = await this.isSourceEnabled(sourceId);
    if (enabled) {
      // delete and create anew
      await this.deleteJobForSource(sourceId);
    }
    try {
      const resp = await Axios.post<gorge.JobDescription>(
        `${GORGE_URL}/jobs`,
        input,
      );
      const job = resp.data;
      // this._jobs should exist due to isSourceEnabled call above
      this._jobs?.set(job.id, job);
      return job;
    } catch (err) {
      throw this._handleError(err);
    }
  }

  public async toggleJobForSource(
    sourceId: string,
    enabled: boolean,
  ): Promise<boolean> {
    const actuallyEnabled = await this.isSourceEnabled(sourceId);
    if (actuallyEnabled === enabled) {
      return enabled;
    }
    if (enabled) {
      await this.createJobForSource(sourceId);
    } else {
      await this.deleteJobForSource(sourceId);
    }
    return enabled;
  }

  public async updateJobForSource(sourceId: string): Promise<void> {
    const enabled = await this.isSourceEnabled(sourceId);
    if (!enabled) {
      return;
    }
    await this.deleteJobForSource(sourceId);
    await this.createJobForSource(sourceId);
  }

  public async getMeasurements(
    script: string,
    code: string,
    filter: MeasurementsFilter<Date>,
  ): Promise<gorge.Measurement[]> {
    try {
      const from = filter.from
        ? Math.ceil(filter.from.getTime() / 1000)
        : undefined;
      const to = filter.to ? Math.ceil(filter.to.getTime() / 1000) : undefined;
      const url =
        `${GORGE_URL}/measurements/${script}/${encodeURIComponent(code)}?` +
        stringify({ from, to });
      const resp = await Axios.get<gorge.Measurement[]>(url);
      return resp.data;
    } catch (err) {
      throw this._handleError(err);
    }
  }

  public getLatest(script: string, code: string) {
    return this._latest.load({ script, code });
  }

  private async _loadLatestBatch(
    keys: Key[],
  ): Promise<Array<gorge.Measurement | null>> {
    if (keys.length === 1) {
      const one = await this._getLatest([keys[0].script], keys[0].code);
      return [one.get(`${keys[0].script}:${keys[0].code}`) ?? null];
    }
    // Many keys
    const scripts = new Set<string>();
    keys.forEach(({ script }) => scripts.add(script));
    const map = await this._getLatest(Array.from(scripts));
    return keys.map(({ script, code }) => map.get(`${script}:${code}`) || null);
  }

  private async _getLatest(
    scripts: string[],
    code?: string,
  ): Promise<Map<string, gorge.Measurement>> {
    if (code && scripts.length !== 1) {
      throw new Error('gauge code can be used with single script only');
    }
    const url = code
      ? `${GORGE_URL}/measurements/${scripts[0]}/${encodeURIComponent(
          code,
        )}/latest`
      : `${GORGE_URL}/measurements/latest?scripts=${scripts.join(',')}`;
    try {
      const resp = await Axios.get<gorge.Measurement[]>(url);
      const result = new Map<string, gorge.Measurement>();
      resp.data.forEach((m) => result.set(`${m.script}:${m.code}`, m));
      return result;
    } catch (err) {
      throw this._handleError(err);
    }
  }
}
