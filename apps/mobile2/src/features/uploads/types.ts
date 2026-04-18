import type {
  FileLike,
  LocalPhoto as TLocalPhoto,
} from '@whitewater-guide/clients';

export interface PhotoFile extends FileLike {
  uri: string;
  size?: number;
}

export type LocalPhoto = TLocalPhoto<PhotoFile>;
