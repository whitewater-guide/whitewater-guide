import type { LocalPhoto as TLocalPhoto } from '@whitewater-guide/clients';
import {
  LocalPhotoStatus,
  validateResolution,
} from '@whitewater-guide/clients';
import { nanoid } from 'nanoid';

import { getImageResolution } from './getImageResolution';

export interface FileWithPreview extends File {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: any;
}

export type LocalPhoto = TLocalPhoto<FileWithPreview>;

export const withPreview = (file: File): FileWithPreview =>
  Object.assign(file, {
    preview: window.URL.createObjectURL(file),
  });

export const toLocalPhoto = async (
  file: File,
  mpxOrResolution?: number | [number, number],
): Promise<LocalPhoto> => {
  const resolution = await getImageResolution(file);
  const error = validateResolution(resolution, mpxOrResolution);
  return {
    id: nanoid(),
    file: withPreview(file),
    resolution,
    status: LocalPhotoStatus.PICKING,
    error,
  };
};

export const cleanupPreview = (file: FileWithPreview) =>
  window.URL.revokeObjectURL(file.preview);
