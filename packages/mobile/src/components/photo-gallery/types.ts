import { License } from '@whitewater-guide/schema';

export interface PhotoGalleryItem {
  image?: string | null;
  resolution?: number[] | null;
  description?: string | null;
  copyright?: string | null;
  license?: License | null;
}
