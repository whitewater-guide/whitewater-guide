import { OfflineError } from '@rnmapbox/maps';

export enum MapboxOfflineErrors {
  TILE_LIMIT_EXCEEDED = 'MAPBOX_TILE_LIMIT_EXCEEDED',
  TIMEOUT = 'MAPBOX_TIMEOUT', // timeout
  SSL_TIMEOUT = 'MAPBOX_SSL_TIMEOUT', // SSL handshake timed out
  DEFAULT = 'MAPBOX_ERROR',
}

export class MapboxOfflineError extends Error {
  public original: OfflineError;

  public recoverable = false;

  constructor(event: OfflineError) {
    super(event.message);
    const { message } = event;
    this.original = event;
    this.name = MapboxOfflineErrors.DEFAULT;
    if (message.includes('tile limit exceeded')) {
      this.name = MapboxOfflineErrors.TILE_LIMIT_EXCEEDED;
    } else if (message.includes('SSL handshake timed out')) {
      this.name = MapboxOfflineErrors.SSL_TIMEOUT;
      this.recoverable = true;
    } else if (message.includes('timeout')) {
      this.name = MapboxOfflineErrors.TIMEOUT;
      this.recoverable = true;
    }
  }
}
