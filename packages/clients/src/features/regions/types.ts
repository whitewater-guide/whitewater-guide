import { Region } from '../../../ww-commons';
import { WithNode } from '../../apollo';

export interface WithRegion {
  region: WithNode<Region>;
}
