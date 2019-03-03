import { Node, Timestamped } from '../../core';

export enum MediaKind {
  photo = 'photo',
  video = 'video',
  blog = 'blog',
}

export interface Media extends Node, Timestamped {
  description: string | null;
  copyright: string | null;
  url: string;
  kind: MediaKind;
  resolution: number[] | null;
  deleted?: boolean;
  weight: number;
  size: number;
  image: string | null;
  thumb?: string | null; // graphql alias for image with arguments
}

export interface MediaInput {
  id: string | null;
  description: string | null;
  copyright: string | null;
  url: string;
  kind: MediaKind;
  resolution: number[] | null;
  weight: number | null;
}
