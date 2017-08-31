import { IsDefined, IsIn, IsString, IsUUID } from 'class-validator';
import { isCoordinated3d } from '../../utils/isCoordinate3d';
import { POITypes } from './POITypes';

export type Coordinate2d = [number, number];
export type Coordinate3d = [number, number, number];
export type Coordinate = Coordinate2d | Coordinate3d;

export function withZeroAlt(coordinates: Coordinate2d[]): Coordinate3d[] {
  return coordinates.map(([lng, lat]) => ([lng, lat, 0] as Coordinate3d));
}

export interface Point {
  id: string;
  name: string | null;
  description: string | null;
  coordinates: Coordinate3d;
  kind: string;
}

export class PointInput {
  @IsUUID()
  id: string | null;

  @IsString()
  name: string | null;

  @IsString()
  description: string | null;

  @IsDefined()
  @isCoordinated3d()
  coordinates: Coordinate;

  @IsDefined()
  @IsIn(POITypes)
  kind: string;
}
