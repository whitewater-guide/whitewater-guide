import {
  License,
  MediaKind,
  Node,
  UploadLink,
} from '@whitewater-guide/commons';

import { RawTimestamped } from '~/db';

export interface MediaRaw extends Node, RawTimestamped {
  language: string;
  default_lang: string;
  kind: MediaKind;
  description: string | null;
  copyright: string | null;
  license: License | null;
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

export interface ImageArgs {
  width?: number;
  height?: number;
}
