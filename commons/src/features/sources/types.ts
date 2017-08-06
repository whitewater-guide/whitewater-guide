import { IsDefined, IsEnum, IsUrl, IsUUID, Length } from 'class-validator';
import { NamedResource, Timestamped } from '../../core';
import { isCron } from '../../utils/isCron';

export enum HarvestMode {
  ALL_AT_ONCE = 'allAtOnce',
  ONE_BY_ONE = 'oneByOne',
}

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
