export interface FileWithPreview {
  file: File;
  preview: any;
}

export const withPreview = (file: File): FileWithPreview => ({
  file,
  preview: window.URL.createObjectURL(file),
});

export const cleanupPreview = (file: FileWithPreview) =>
  window.URL.revokeObjectURL(file.preview);

export const isFileWithPreview = (value: any): value is FileWithPreview =>
  value.hasOwnProperty('preview') && value.hasOwnProperty('file') && (value.file instanceof File);
