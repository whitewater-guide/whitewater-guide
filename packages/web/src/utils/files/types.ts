import {
  LocalPhoto as TLocalPhoto,
  LocalPhotoStatus,
  validateResolution,
} from '@whitewater-guide/clients';
import shortid from 'shortid';

import { getImageResolution } from './getImageResolution';

export interface FileWithPreview extends File {
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
    id: shortid(),
    file: withPreview(file),
    resolution,
    status: LocalPhotoStatus.PICKING,
    error,
  };
};

export const cleanupPreview = (file: FileWithPreview) =>
  window.URL.revokeObjectURL(file.preview);
