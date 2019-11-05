export interface FileLike {
  name: string;
  type: string;
}

export enum LocalPhotoStatus {
  PICKING = 1,
  UPLOADING,
  READY,
}

export interface LocalPhoto<F extends FileLike = FileLike> {
  id: string;
  file?: F;
  resolution: [number, number];
  url?: string;
  status: LocalPhotoStatus;
  error?: string | { key: string; options?: any };
}

export const isLocalPhoto = (v: any): v is LocalPhoto =>
  !!v &&
  typeof v === 'object' &&
  !!v.resolution &&
  !!v.status &&
  (!!v.file || !!v.url);
