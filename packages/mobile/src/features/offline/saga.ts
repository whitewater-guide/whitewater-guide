import ApolloClient, { ObservableQuery } from 'apollo-client';
import flatMap from 'lodash/flatMap';
import FastImage from 'react-native-fast-image';
import { END, eventChannel } from 'redux-saga';
import { apply, call, put, select, take } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { getApolloClient } from '../../core/apollo';
import { RootState } from '../../core/reducers';
import { getListMerger, Page } from '../../ww-clients/apollo';
import { REGION_DETAILS } from '../../ww-clients/features/regions';
import { Connection } from '../../ww-commons';
import { NamedNode } from '../../ww-commons/core';
import { RegionMediaSummary } from '../../ww-commons/features/regions';
import { Section } from '../../ww-commons/features/sections';
import { getThumbUri, getUri } from '../media';
import { offlineContentActions } from './actions';
import { OFFLINE_SECTIONS, Result as OfflineQResult, Vars as OfflineQVars } from './offlineSections.query';
import { REGION_MEDIA_SUMMARY, Result, Vars } from './regionMediaSummary.query';
import { OfflineCategorySelection } from './types';

export function* offlineContentSaga() {
  while (true) {
    yield call(downloadOfflineContent);
  }
}

export function* downloadOfflineContent() {
  const { payload }: Action<OfflineCategorySelection> = yield take(offlineContentActions.startDownload);
  const region: NamedNode = yield select((state: RootState) => state.offlineContent.dialogRegion);
  if (!region) {
    return;
  }
  // get media summary
  const client: ApolloClient<any> = yield getApolloClient();
  const mediaQueryResult = client.readQuery<Result, Vars>({
    query: REGION_MEDIA_SUMMARY,
    variables: { regionId: region.id },
  });
  const summary: RegionMediaSummary = mediaQueryResult!.region!.mediaSummary!;
  // dispatch progress
  yield put(offlineContentActions.updateProgress({
    regionInProgress: region.id,
    data: [0, mediaQueryResult!.region!.sections!.count!],
    media: [0, summary.photo.count * 2], // multiply for thumbs
  }));

  // download region query
  yield apply(
    client,
    client.query as any,
    [{
      query: REGION_DETAILS,
      variables: { regionId: region.id },
      fetchPolicy: 'network-only',
    }],
  );

  // batch-download sections, form media list
  const query: ObservableQuery<OfflineQResult, OfflineQVars> = client.watchQuery<OfflineQResult, OfflineQVars>({
    query: OFFLINE_SECTIONS,
    fetchPolicy: 'cache-only', // so the query is not fired right away
    variables: { regionId: region.id },
  }) as any;

  const dummySub = query.subscribe(() => {});
  const sections: Required<Connection<Section>> = yield call(downloadSections, query);
  dummySub.unsubscribe();

  // download media and thumbs
  const media = extractPhotos(sections.nodes);
  yield call(downloadPhotos, media);

  // dispatch download complete
  yield put(offlineContentActions.finishDownload());
}

export function* downloadSections(
  query: ObservableQuery<OfflineQResult, OfflineQVars>,
  page: Page = { offset: 0, limit: 20 },
): any {
  const options = {
    variables: { page },
    updateQuery: getListMerger('sections') as any,
  };
  yield apply(
    query,
    query.fetchMore as any,
    [options],
  );
  const sections = (query.currentResult().data as any).sections;
  yield put(offlineContentActions.updateProgress({
    data: [sections.nodes.length, sections.count],
  }));
  if (sections.nodes.length < sections.count) {
    const result: OfflineQResult = yield call(
      downloadSections,
      query,
      { offset: sections.nodes.length, limit: page.limit },
    );
    return result;
  } else {
    return sections;
  }
}

function extractPhotos(sections: Section[]): string[] {
  return flatMap(sections, (section) => {
    if (!section.media || !section.media.nodes) {
      return [];
    }
    return section.media.nodes.reduce(
      (urls, { kind, url }) => kind === 'photo' ? [ ...urls, getUri(url).url, getThumbUri(url).uri ] : urls,
      [] as string[],
    );
  });
}

function *downloadPhotos(photos: string[]) {
  const chan = eventChannel((emitter) => {
    FastImage.preload(
      photos.map((uri) => ({ uri })),
      (loaded: number, total: number) => emitter([loaded, total]),
      () => emitter(END),
    );
    return () => {};
  });
  try {
    while (true) {
      const progress = yield take(chan);
      yield put(offlineContentActions.updateProgress({ media: progress }));
    }
  } finally {
    // console.log('Media download complete');
  }
}
