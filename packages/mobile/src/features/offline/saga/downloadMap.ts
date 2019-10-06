import MapboxGL from '@react-native-mapbox-gl/maps';
import { getBBox } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/commons';
import Layers from 'components/map/layers';
import { channel, Channel, END } from 'redux-saga';
import { apply, call, put, takeMaybe } from 'redux-saga/effects';
import { trackError } from '../../../core/errors';
import { offlineContentActions } from '../actions';
import { MapboxOfflinePackState } from '../types';

interface ChannelMessage {
  percentage: number;
  completed: boolean;
}

// Norway 4 ~ 10
//    1143 tiles
//    135 183 000 resources
//    61 738 308 tiles
// Norway 1 ~ 10
//    1146 tiles
//    135 362 345 resources
//    61 917 653 tiles
// Norway 1 ~ 9
//    321 tiles
//    115 Mb
export default function* downloadMap(region: Pick<Region, 'id' | 'bounds'>) {
  let offlinePack = yield apply(
    MapboxGL.offlineManager,
    MapboxGL.offlineManager.getPack,
    [region.id],
  );
  if (offlinePack) {
    const status = yield apply(offlinePack, offlinePack.status, []);
    // do not download what is already downloaded
    if (status.state === MapboxOfflinePackState.COMPLETE) {
      return;
    }
    try {
      yield apply(offlinePack, offlinePack.resume, []);
    } catch (e) {
      trackError('offlineMaps', e);
    }
  } else {
    offlinePack = yield call(createOfflinePack, region);
  }

  const chan = yield call(channel);
  yield call(subscribeToPackProgress, region.id, chan);
  yield call(listenToPackProgress, chan);
  yield call(unsubscribeFromPackProgress, region.id);
}

function* createOfflinePack(region: Pick<Region, 'id' | 'bounds'>) {
  const bounds = getBBox(region.bounds);

  const pack = yield apply(
    MapboxGL.offlineManager,
    MapboxGL.offlineManager.createPack,
    [
      {
        name: region.id,
        styleURL: Layers.TERRAIN.url,
        bounds,
        minZoom: 1,
        maxZoom: 10,
      },
    ],
  );
  return pack;
}

function* subscribeToPackProgress(
  regionId: string,
  chan: Channel<ChannelMessage>,
) {
  yield apply(MapboxGL.offlineManager, MapboxGL.offlineManager.subscribe, [
    regionId,
    (pack, progress) => {
      const msg: ChannelMessage = {
        completed: progress.state === MapboxOfflinePackState.COMPLETE,
        percentage: Math.floor(progress.percentage),
      };
      chan.put(msg);
    },
    (pack, error) => {
      const err = new Error(error.message);
      err.name = error.name;
      trackError('downloadMap', err);
      chan.put(END);
    },
  ]);
}

function* listenToPackProgress(chan: Channel<ChannelMessage>) {
  while (true) {
    const msg: ChannelMessage | END = yield takeMaybe(chan);
    if (msg === END) {
      yield put(
        offlineContentActions.failDownload({
          message: 'offline:dialog.mapsError',
        }),
      );
      break;
    }
    const { completed, percentage } = msg as ChannelMessage;
    yield put(
      offlineContentActions.updateProgress({ maps: [percentage, 100] }),
    );
    if (completed) {
      chan.close();
      break;
    }
  }
}

function* unsubscribeFromPackProgress(regionId: string) {
  yield apply(MapboxGL.offlineManager, MapboxGL.offlineManager.unsubscribe, [
    regionId,
  ]);
}
