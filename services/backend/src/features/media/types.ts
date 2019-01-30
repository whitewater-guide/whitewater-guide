import { RawTimestamped } from '@db';
import { MediaKind, Node, UploadLink } from '@whitewater-guide/commons';

export interface MediaRaw extends Node, RawTimestamped {
  kind: MediaKind;
  description: string | null;
  copyright: string | null;
  url: string;
  resolution: number[] | null;
  weight: number;
  deleted?: boolean;
  created_by: string | null;
  size: number;
}

export interface MediaUploadForm {
  id: string;
  upload: UploadLink;
}
