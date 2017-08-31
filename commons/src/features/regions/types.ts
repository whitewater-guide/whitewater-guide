import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsDefined,
  IsInt,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { GrapqhlResource, Timestamped } from '../../core';
import { isCoordinated3d } from '../../utils';
import { Coordinate3d, Point } from '../points';
import { PointInput } from '../points/types';

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
  id: string | null;

  @IsDefined()
  @Length(3, 128)
  name: string;

  @IsString()
  description: string | null;

  @IsString()
  season: string | null;

  @IsDefined()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @ArrayMaxSize(24)
  seasonNumeric: number[];

  @IsDefined()
  @isCoordinated3d({ each: true })
  bounds?: Coordinate3d[];

  @IsBoolean()
  hidden: boolean;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PointInput)
  pois: PointInput[];
}
