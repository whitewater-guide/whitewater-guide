import { Connection, Page, Section } from '@whitewater-guide/commons';
import { ObservableQuery } from 'apollo-client';
import { Channel, END } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { apolloClient } from '../../../core/apollo';
import { offlineContentActions } from '../actions';
import { OFFLINE_SECTIONS, Result, Vars } from '../offlineSections.query';
import fetchMoreSections from './calls/fetchMoreSections';
import { DEFAULT_PAGE_SIZE } from './constants';
import { extractPhotos } from './utils';

export default function* downloadSections(
  regionId: string,
  mediaChannel?: Channel<string[]>,
  client = apolloClient,
) {
  const query: ObservableQuery<Result, Vars> = client.watchQuery<Result, Vars>({
    query: OFFLINE_SECTIONS,
    fetchPolicy: 'cache-only', // so the query is not fired right away
    variables: { filter: { regionId } },
  });

  const dummySub = query.subscribe(() => {});
  yield call(downloadSectionsWorker, query, mediaChannel);
  dummySub.unsubscribe();

  // Only to test the result
  return query.currentResult();
}

function* downloadSectionsWorker(
  query: ObservableQuery<Result, Vars>,
  mediaChannel?: Channel<string[]>,
  page?: Page,
): any {
  const { offset = 0, limit = DEFAULT_PAGE_SIZE } = page || {};
  yield call(fetchMoreSections, query, { offset, limit });
  const sections: Required<Connection<Section>> = (query.currentResult()
    .data as Result).sections;
  yield put(
    offlineContentActions.updateProgress({
      data: sections.nodes.length,
    }),
  );

  if (mediaChannel) {
    const photos = extractPhotos(sections.nodes.slice(offset, offset + limit));
    yield put(mediaChannel, photos);
  }

  if (sections.nodes.length < sections.count) {
    yield call(downloadSectionsWorker, query, mediaChannel, {
      offset: sections.nodes.length,
      limit,
    });
  } else if (mediaChannel) {
    yield put(mediaChannel, END);
  }
}
