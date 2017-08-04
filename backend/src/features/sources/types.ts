import { IsDefined, IsEnum, IsUrl, IsUUID, Length } from 'class-validator';
import { NamedResource } from '../../apollo';
import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { Timestamped } from '../../db/types';
import { isCron } from '../../util/isCron';

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

/**
 * This is graphql type
 */
export interface Source extends NamedResource, Timestamped {
  termsOfUse: string | null;
  script: string;
  cron: string | null;
  harvestMode: HarvestMode;
  url: string | null;
  enabled: boolean | null;
}

export class SourceInput {
  @IsUUID()
  id?: string;

  @Length(3, 128)
  name: string;

  termsOfUse?: string;

  @IsDefined()
  script: string;

  @isCron()
  cron?: string;

  @IsEnum(HarvestMode)
  harvestMode: HarvestMode;

  @IsUrl()
  url?: string;
}

export function inputToRaw(input: SourceInput): Partial<SourceRaw> {
  return {
    id: input.id,
    name: input.name,
    terms_of_use: input.termsOfUse,
    script: input.script,
    cron: input.cron,
    harvest_mode: input.harvestMode,
    url: input.url,
  };
}
