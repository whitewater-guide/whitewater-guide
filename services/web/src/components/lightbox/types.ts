import { MediaKind } from '@whitewater-guide/commons';

export interface LightboxItem {
  id: string | null;
  kind?: MediaKind;
  image?: string | null;
  url?: string | null;
  description: string | null;
  copyright: string | null;
}
