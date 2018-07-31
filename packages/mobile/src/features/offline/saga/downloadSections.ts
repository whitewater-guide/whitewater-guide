import { ApolloClient, ObservableQuery } from 'apollo-client';
import { Channel, END } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { getApolloClient } from '../../../core/apollo';
import { Page } from '../../../ww-clients/apollo';
import { Connection } from '../../../ww-commons/features';
import { Section } from '../../../ww-commons/features/sections';
import { offlineContentActions } from '../actions';
import { OFFLINE_SECTIONS, Result, Vars } from '../offlineSections.query';
import fetchMoreSections from './calls/fetchMoreSections';
import resetOfflineSections from './calls/resetOfflineSections';
import { extractPhotos } from './utils';

export default function *downloadSections(regionId: string, mediaChannel?: Channel<string[]>) {
  const client: ApolloClient<any> = yield call(getApolloClient);
  yield call(resetOfflineSections, regionId);
  const query: ObservableQuery<Result, Vars> = client.watchQuery<Result, Vars>({
    query: OFFLINE_SECTIONS,
    fetchPolicy: 'cache-only', // so the query is not fired right away
    variables: { regionId },
  }) as any;

  const dummySub = query.subscribe(() => {});
  yield call(downloadSectionsWorker, query, mediaChannel);
  dummySub.unsubscribe();
}

export function* downloadSectionsWorker(
  query: ObservableQuery<Result, Vars>,
  mediaChannel?: Channel<string[]>,
  page?: Page,
): any {
  const { offset = 0, limit = 20 } = page || {};
  yield call(fetchMoreSections, query, { offset, limit });
  const sections: Required<Connection<Section>> = (query.currentResult().data as any).sections;
  yield put(offlineContentActions.updateProgress({
    data: sections.nodes.length,
  }));

  const photos = extractPhotos(sections.nodes.slice(offset, offset + limit));
  if (mediaChannel) {
    yield put(mediaChannel, photos);
  }

  if (sections.nodes.length < sections.count) {
    yield call(
      downloadSectionsWorker,
      query,
      mediaChannel,
      { offset: sections.nodes.length, limit },
    );
  }
  if (mediaChannel) {
    yield put(mediaChannel, END);
  }
}