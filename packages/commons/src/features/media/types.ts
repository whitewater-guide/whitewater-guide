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
  thumb?: string;
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

export enum ThumbResize {
  FIT = 'fit',
  FILL = 'fill',
  CROP = 'crop',
}

export enum ThumbGravity {
  NORTH = 'no',
  SOUTH = 'so',
  EAST = 'ea',
  WEST = 'we',
  CENTER = 'ce',
  SMART = 'sm',
}

export interface ThumbOptions {
  width: number;
  height: number;
  resize?: ThumbResize;
  gravity?: ThumbGravity;
}
