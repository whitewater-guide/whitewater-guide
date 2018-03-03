import { Node, Timestamped } from '../../core';

export enum MediaKind {
  photo = 'photo',
  video = 'video',
  blog = 'blog',
}

export interface Media extends Node, Timestamped {
  language: string;
  description: string | null;
  copyright: string | null;
  url: string;
  kind: MediaKind;
  resolution: number[] | null;
  deleted?: boolean;
  weight: number;
}

export interface MediaInput {
  id: string;
  description: string | null;
  copyright: string | null;
  url: string;
  kind: MediaKind;
  resolution: number[] | null;
  weight: number;
}
