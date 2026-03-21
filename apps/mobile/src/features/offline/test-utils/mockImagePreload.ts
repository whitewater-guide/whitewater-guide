type ProgressListener = (_: any, loaded: number, total: number) => void;
type CompleteListener = (
  urls: string[],
  loaded: number,
  skipped: number,
) => void;

export const mockImagePreload = (
  photos: any[],
  onProgress: ProgressListener,
  onComplete: CompleteListener,
) => {
  const total = photos.length;
  const download = (
    n: number,
    progress: ProgressListener,
    complete: CompleteListener,
  ) => {
    setTimeout(() => {
      if (n >= total) {
        complete(photos, total, 0);
      } else {
        progress(photos.slice(0, n + 1), n + 1, total);
        download(n + 1, progress, complete);
      }
    }, 1);
  };
  download(0, onProgress, onComplete);
};
