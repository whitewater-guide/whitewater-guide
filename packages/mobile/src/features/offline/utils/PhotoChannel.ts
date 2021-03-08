export class PhotoChannel {
  private _queue: string[] = [];
  private _closed = false;
  private _broken: Error | null = null;

  constructor(private readonly _batchSize = 25) {}

  public put(urls: string[]) {
    if (this._closed) {
      throw new Error('channel is closed');
    }
    this._queue.push(...urls);
  }

  public take() {
    if (this._broken) {
      throw this._broken;
    }
    const result = this._queue.slice(0, this._batchSize);
    this._queue = this._queue.slice(this._batchSize);
    return result;
  }

  // this is required because photo download doesn't fail on network errors
  // so when sections downloader fails, it uses this to make photo downloader fail too
  public break(e: Error) {
    this._broken = e;
  }

  public close() {
    this._closed = true;
  }

  public get closed() {
    return this._closed;
  }

  public get broken() {
    return !!this._broken;
  }
}
