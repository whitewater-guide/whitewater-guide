import { Node, Timestamped } from '../../apollo';
import { License } from '../licenses';

export enum MediaKind {
  photo = 'photo',
  video = 'video',
  blog = 'blog',
}

interface MediaBase {
  description: string | null;
  url: string;
  kind: MediaKind;
  resolution: number[] | null;
  weight: number | null;

  copyright: string | null;
  license: License | null;
}

export interface Media extends MediaBase, Node, Timestamped {
  deleted?: boolean;
  size: number;
  image: string | null;
  thumb?: string | null; // graphql alias for image with arguments
}

export interface MediaInput extends MediaBase {
  id: string | null;
}
