import { Connection, NamedNode, Node, Timestamped } from '../../apollo';
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
  region: Node;
}

export interface RiversFilter {
  regionId?: string;
}
