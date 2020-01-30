import { WithLanguage } from '@apollo';
import { RawTimestamped } from '@db';
import { NamedNode } from '@whitewater-guide/commons';

/**
 * Raw row from database `source` table
 */
export interface SourceRaw extends NamedNode, RawTimestamped, WithLanguage {
  terms_of_use: string | null;
  script: string;
  request_params: any;
  cron: string | null;
  url: string | null;
}
