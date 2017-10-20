import { NamedNode, Timestamped } from '../../core/types';
import { Region, RegionInput } from '../regions';
import { Section } from '../sections';

export interface River extends NamedNode, Timestamped {
  description: string | null;
  region: Region;
  sections: [Section];
}

export interface RiverInput extends NamedNode {
  description: string | null;
  region: Pick<RegionInput, 'id' | 'name'>;
}
