import { NamedNode } from '@whitewater-guide/commons';

import { WithLanguage } from '~/apollo';

export interface GroupRaw extends NamedNode, WithLanguage {
  sku: string | null;
  all_regions: boolean;
}
