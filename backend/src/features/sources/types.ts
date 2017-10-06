import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { NamedResource } from '../../ww-commons';

export const SourcesSchema = loadGraphqlFile('sources');

export enum HarvestMode {
  ALL_AT_ONCE = 'allAtOnce',
  ONE_BY_ONE = 'oneByOne',
}

/**
 * Raw row from database `source` table
 */
export interface SourceRaw extends NamedResource, RawTimestamped {
  terms_of_use: string | null;
  script: string;
  cron: string | null;
  harvest_mode: HarvestMode;
  url: string | null;
  enabled: boolean | null;
}
