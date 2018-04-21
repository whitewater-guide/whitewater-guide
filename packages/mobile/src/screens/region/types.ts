import { WithList, WithNode } from '../../ww-clients/apollo';
import { Region, Section } from '../../ww-commons';

export interface ScreenProps {
  region: WithNode<Region>;
  sections: WithList<Section>;
}
