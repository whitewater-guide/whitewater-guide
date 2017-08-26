import { ArrayMaxSize, IsDefined, IsInt, IsUUID, Length, Max, Min } from 'class-validator';
/**
 * This is graphql type
 */
import { GrapqhlResource, Timestamped } from '../../core/types';

export interface Region extends GrapqhlResource, Timestamped {
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Array<[number, number, number]> | null;
  hidden: boolean | null;
  riversCount?: number;
  sectionsCount?: number;
}

export class RegionInput {
  @IsUUID()
  id?: string;

  @IsDefined()
  @Length(3, 128)
  name: string;

  description?: string;

  season?: string;

  @IsDefined()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @ArrayMaxSize(24)
  seasonNumeric?: number[];

  // TODO: add validation
  bounds?: Array<[number, number, number]>;

  hidden?: boolean;
}
