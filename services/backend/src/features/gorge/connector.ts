import { Context } from '@apollo';
import db from '@db';
import { DataSource } from 'apollo-datasource';
import Axios from 'axios';
import DataLoader from 'dataloader';
import {
  GorgeError,
  GorgeGauge,
  GorgeJob,
  GorgeMeasurement,
  GorgeScript,
  GorgeStatus,
  JobRaw,
} from './types';

const GORGE_HOST = 'gorge';
const GORGE_PORT = '7080';
const GORGE_PATH = '';
const GORGE_URL = `http://${GORGE_HOST}:${GORGE_PORT}${GORGE_PATH}`;

interface Key {
  script: string;
  code: string;
}

const DLOptions: DataLoader.Options<Key, GorgeMeasurement> = {
  cacheKeyFn: ({ script, code }: Key) => `${script}:${code}`,
};

export class GorgeConnector implements DataSource<Context> {
  private _scripts?: GorgeScript[];
  private _gauges?: GorgeGauge[];
  private _gaugeStatuses?: Map<string, Map<string, GorgeStatus>>;
  private _jobs?: Map<string, GorgeJob>;
  private readonly _latest: DataLoader<Key, GorgeMeasurement>;

  constructor() {
    this._loadLatestBatch = this._loadLatestBatch.bind(this);
    this._latest = new DataLoader<Key, GorgeMeasurement>(
      this._loadLatestBatch,
      DLOptions,
    );
  }

  initialize() {
    // no-op
  }

  private _handleError(err: any): Error {
    if (err.response) {
      return new Error((err.response?.data as GorgeError)?.error);
    }
    return err;
  }

  public async listScripts(): Promise<GorgeScript[]> {
    try {
      if (!this._scripts) {
        const resp = await Axios.get<GorgeScript[]>(`${GORGE_URL}/scripts`);
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
  ): Promise<GorgeGauge[]> {
    try {
      if (!this._gauges) {
        const resp = await Axios.post<GorgeGauge[]>(
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

  public async listJobs(): Promise<Map<string, GorgeJob>> {
    try {
      if (!this._jobs) {
        const resp = await Axios.get<GorgeJob[]>(`${GORGE_URL}/jobs`);
        this._jobs = new Map(resp.data.map((j) => [j.id, j]));
      }
    } catch (err) {
      throw this._handleError(err);
    }
    return this._jobs || new Map();
  }

  public async getJobForSource(
    sourceId: string,
  ): Promise<GorgeJob | undefined> {
    const jobs = await this.listJobs();
    return jobs.get(sourceId);
  }

  public async isSourceEnabled(sourceId: string): Promise<boolean> {
    const job = await this.getJobForSource(sourceId);
    return !!job;
  }

  public async getGaugeStatuses(
    sourceId: string,
  ): Promise<Map<string, GorgeStatus>> {
    try {
      if (!this._gaugeStatuses) {
        this._gaugeStatuses = new Map();
      }
      let sourceMap = this._gaugeStatuses.get(sourceId);
      if (!sourceMap) {
        const resp = await Axios.get<Record<string, GorgeStatus>>(
          `${GORGE_URL}/jobs/${sourceId}/gauges`,
        );
        sourceMap = new Map();
        // tslint:disable-next-line: forin
        for (const gaugeId in resp.data) {
          sourceMap.set(gaugeId, resp.data[gaugeId]);
        }
        this._gaugeStatuses.set(sourceId, sourceMap);
      }
      return sourceMap!;
    } catch (err) {
      throw this._handleError(err);
    }
  }

  public async deleteJobForSource(sourceId: string): Promise<void> {
    try {
      await Axios.delete(`${GORGE_URL}/jobs/${sourceId}`);
    } catch (err) {
      throw this._handleError(err);
    }
  }

  public async createJobForSource(sourceId: string): Promise<GorgeJob> {
    const input: JobRaw = await db()
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
      const resp = await Axios.post<GorgeJob>(`${GORGE_URL}/jobs`, input);
      return resp.data;
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
    days: number,
  ): Promise<GorgeMeasurement[]> {
    try {
      const from = Math.ceil(new Date().getTime() / 1000) - 60 * 60 * 24 * days;
      const url = `${GORGE_URL}/measurements/${script}/${code}?from=${from}`;
      const resp = await Axios.get<GorgeMeasurement[]>(url);
      return resp.data;
    } catch (err) {
      throw this._handleError(err);
    }
  }

  public getLatest(script: string, code: string) {
    return this._latest.load({ script, code });
  }

  private async _loadLatestBatch(keys: Key[]) {
    if (keys.length === 1) {
      return this._getLatest([keys[0].script], keys[0].code);
    }
    // Many keys
    const scripts = new Set<string>();
    keys.forEach(({ script }) => scripts.add(script));
    return this._getLatest(Array.from(scripts));
  }

  private async _getLatest(
    scripts: string[],
    code?: string,
  ): Promise<GorgeMeasurement[]> {
    if (code && scripts.length !== 1) {
      throw new Error('gauge code can be used with single script only');
    }
    const url = code
      ? `${GORGE_URL}/measurements/${scripts[0]}/${code}/latest`
      : `${GORGE_URL}/measurements/latest?scripts=${scripts.join(',')}`;
    try {
      const resp = await Axios.get<GorgeMeasurement[]>(url);
      return resp.data;
    } catch (err) {
      throw this._handleError(err);
    }
  }
}
