import { NamedNode } from '@ww-commons';

export interface GroupRaw extends NamedNode {
  sku: string | null;
  all_regions: boolean;
  language: string;
}
