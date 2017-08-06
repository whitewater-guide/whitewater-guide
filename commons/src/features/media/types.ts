export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
  BLOG = 'blog',
}

export interface Media {
  id: string;
  description: string | null;
  copyright: string | null;
  url: string;
  type: MediaType;
  width: number | null;
  height: number | null;
}

export interface MediaInput {
  id: string;
  description: string | null;
  copyright: string | null;
  url: string;
  type: MediaType;
  width: number | null;
  height: number | null;

  deleted: boolean;
  file: any;
}
