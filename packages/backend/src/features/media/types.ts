import { RawTimestamped } from '../../db';
import { MediaKind, Node } from '../../ww-commons';

export interface MediaRaw extends Node, RawTimestamped {
  language: string;
  kind: MediaKind;
  description: string | null;
  copyright: string | null;
  url: string;
  resolution: number[] | null;
  weight: number;
}
