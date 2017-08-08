import { NamedResource, Timestamped } from '../../core/types';
import { Region, RegionInput } from '../regions';
import { Section } from '../sections';

export interface River extends NamedResource, Timestamped {
  description: string | null;
  region: Region;
  sections: [Section];
}

export interface RiverInput extends NamedResource {
  description: string | null;
  region: Pick<RegionInput, 'id' | 'name'>;
}
