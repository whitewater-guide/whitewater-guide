import { RawTimestamped } from '../../db';
import { MediaKind, Node, UploadLink } from '../../ww-commons';

export interface MediaRaw extends Node, RawTimestamped {
  language: string;
  kind: MediaKind;
  description: string | null;
  copyright: string | null;
  url: string;
  resolution: number[] | null;
  weight: number;
  deleted?: boolean;
}

export interface MediaUploadForm {
  id: string;
  upload: UploadLink;
}
