import { WithLanguage } from '~/apollo';
import { NamedNode } from '@whitewater-guide/commons';

export interface GroupRaw extends NamedNode, WithLanguage {
  sku: string | null;
  all_regions: boolean;
}
