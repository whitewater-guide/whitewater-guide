type ProgressListener = (_: any, n: number) => void;
type CompleteListener = () => void;

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
        complete();
      } else {
        progress(undefined, n + 1);
        download(n + 1, progress, complete);
      }
    }, 1);
  };
  download(0, onProgress, onComplete);
};
