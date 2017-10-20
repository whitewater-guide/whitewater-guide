import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { HarvestMode, NamedNode } from '../../ww-commons';

export const SourcesSchema = loadGraphqlFile('sources');

/**
 * Raw row from database `source` table
 */
export interface SourceRaw extends NamedNode, RawTimestamped {
  terms_of_use: string | null;
  script: string;
  cron: string | null;
  harvest_mode: HarvestMode;
  url: string | null;
  enabled: boolean | null;
}
