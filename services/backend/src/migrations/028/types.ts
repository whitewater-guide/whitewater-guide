import { Coordinate3d } from '@whitewater-guide/commons';

export interface FeatureProps {
  name: string;
  description: string;
  styleUrl: string;
}

export interface KMLSection {
  river: string;
  name: string;
  description: string | null;
  difficulty: number;
  difficultyXtra: string | null;
  coordinates: Coordinate3d[];
}
