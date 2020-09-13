import { sleep } from '@whitewater-guide/clients';
import FastImage, { PreloadProgressHandler } from 'react-native-fast-image';

import { OfflineProgress } from '../types';
import { PhotoChannel } from '../utils';

const preload = (photos: string[], onProgress: PreloadProgressHandler) =>
  new Promise((resolve) => {
    FastImage.preload(
      photos.map((uri) => ({ uri })),
      onProgress,
      () => resolve(),
    );
  });

type ProgressListener = (progress: Pick<OfflineProgress, 'media'>) => void;

export class PhotoDownloader {
  private _counter = 0;
  private _called = false;

  constructor(
    private readonly _estimatedTotal: number,
    private readonly _onProgress: ProgressListener,
    private readonly _sleepStep = 300,
  ) {}

  public async download(channel: PhotoChannel): Promise<void> {
    if (this._called) {
      throw new Error('PhotoDownloader download already called');
    }
    this._called = true;
    this._counter = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const more = channel.take();
      if (!more.length) {
        if (channel.closed) {
          return;
        }
        await sleep(this._sleepStep);
        continue;
      }
      await preload(more, this.onProgress);
      this._counter += more.length;
    }
  }

  private onProgress = (urls: string[], loaded: number, total: number) => {
    this._onProgress({ media: [this._counter + loaded, this._estimatedTotal] });
  };
}