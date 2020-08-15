import MapboxGL, {
  OfflineError,
  OfflinePack,
  OfflinePackStatus,
} from '@react-native-mapbox-gl/maps';
import { getBBox } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/commons';
import Layers from '~/components/map/layers';
import { trackError } from '~/core/errors';
import { MapboxOfflineError } from '../errors';
import { MapboxOfflinePackState, OfflineProgress } from '../types';

export default class MapDownloader {
  private _resolve!: (v?: unknown) => void;
  private _reject!: (e: Error) => void;
  private _called = false;

  constructor(
    private readonly _regionId: string,
    private readonly _bounds: Region['bounds'],
    private readonly _onProgress: (prg: Pick<OfflineProgress, 'maps'>) => void,
  ) {}

  public async download(): Promise<unknown> {
    if (this._called) {
      throw new Error('MapDownloader download can only be called once');
    }
    this._called = true;
    this.onProgress(0);
    const offlinePack = await MapboxGL.offlineManager.getPack(this._regionId);

    if (offlinePack) {
      const status = await offlinePack.status();
      // do not download what is already downloaded
      if (status?.state === MapboxOfflinePackState.COMPLETE) {
        this.onProgress(100);
        return;
      }
      this.subscribe();
      const result = this.promisify();
      offlinePack.resume();
      return result;
    } else {
      this.subscribe();
      const result = this.promisify();
      MapboxGL.offlineManager.createPack({
        name: this._regionId,
        styleURL: Layers.TERRAIN.url,
        bounds: getBBox(this._bounds),
        minZoom: 1,
        maxZoom: 10,
      });
      return result;
    }
  }

  private subscribe() {
    MapboxGL.offlineManager.subscribe(
      this._regionId,
      this.onPackProgress,
      this.onPackError,
    );
  }

  private async unsubscribe() {
    MapboxGL.offlineManager.unsubscribe(this._regionId);
  }

  private promisify = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    }).finally(() => {
      this.unsubscribe();
    });
  };

  private onProgress = (percentage: number) => {
    this._onProgress({ maps: [percentage, 100] });
  };

  private onPackProgress = (_: OfflinePack, status: OfflinePackStatus) => {
    this.onProgress(Math.floor(status.percentage));
    if (status.state === MapboxOfflinePackState.COMPLETE) {
      this._resolve();
    }
  };

  private onPackError = (_: OfflinePack, e: OfflineError) => {
    const error = new MapboxOfflineError(e);
    if (!error.recoverable) {
      trackError('offlineMaps', error, e);
      this.onProgress(0);
      this._reject(error);
    }
  };
}
