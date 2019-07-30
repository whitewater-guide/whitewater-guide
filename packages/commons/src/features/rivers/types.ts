import { Connection, NamedNode, NodeRef, Timestamped } from '../../apollo';
import { Region } from '../regions';
import { Section } from '../sections';

export interface River extends NamedNode, Timestamped {
  region: Region;
  sections: Connection<Section>;
  altNames: string[];
}

export interface RiverInput {
  id: string | null;
  name: string;
  altNames: string[] | null;
  region: NodeRef;
}

export interface RiversFilter {
  search?: string;
  regionId?: string;
}
