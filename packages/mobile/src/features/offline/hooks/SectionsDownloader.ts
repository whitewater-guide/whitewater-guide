import { getListMerger } from '@whitewater-guide/clients';
import ApolloClient from 'apollo-client';
import { DocumentNode } from 'graphql';

import { PHOTO_SIZE_PX } from '~/features/media';

import {
  ListSectionsDocument,
  ListSectionsQuery,
  ListSectionsQueryVariables,
} from '../offlineSections.generated';
import { OfflineProgress } from '../types';
import { extractPhotos, PhotoChannel } from '../utils';

type ProgressListener = (progress: Pick<OfflineProgress, 'data'>) => void;

interface Options {
  apollo: ApolloClient<any>;
  onProgress: ProgressListener;
  photoChannel: PhotoChannel;
  query?: DocumentNode;
  limit?: number;
}

export class SectionsDownloader {
  private readonly _client: ApolloClient<any>;

  private readonly _photoChannel: PhotoChannel;

  private readonly _onProgress: ProgressListener;

  private readonly _pageSize: number;

  private readonly _query: DocumentNode;

  private _called = false;

  constructor(opts: Options) {
    this._client = opts.apollo;
    this._photoChannel = opts.photoChannel;
    this._onProgress = opts.onProgress;
    this._pageSize = opts.limit || 40;
    this._query = opts.query || ListSectionsDocument;
  }

  public async download(
    regionId: string,
    estimatedTotal: number,
  ): Promise<void> {
    if (this._called) {
      this._photoChannel.close();
      throw new Error('SectionsDownloader download already called');
    }
    this._called = true;
    let [offset, total] = [0, estimatedTotal];
    this._onProgress({ data: [offset, total] });
    let merged: ListSectionsQuery | undefined;
    const merger = getListMerger('sections');
    try {
      while (offset < total) {
        const { data, errors } = await this._client.query<
          ListSectionsQuery,
          ListSectionsQueryVariables
        >({
          query: this._query,
          errorPolicy: 'none',
          fetchPolicy: 'network-only',
          variables: {
            filter: { regionId },
            page: { offset, limit: this._pageSize },
            thumbHeight: PHOTO_SIZE_PX,
            thumbWidth: PHOTO_SIZE_PX,
          },
        });
        if (errors?.length) {
          throw errors[0];
        }
        offset += data.sections.nodes.length;
        total = data.sections.count;
        this._onProgress({ data: [offset, total] });
        this._photoChannel.put(extractPhotos(data.sections.nodes));
        merged = merged
          ? (merger(merged, { fetchMoreResult: data }) as any)
          : data;
        this._client.writeQuery({
          query: this._query,
          data: merged,
          variables: { filter: { regionId } },
        });
      }
    } catch (e) {
      this._photoChannel.break(e);
      throw e;
    } finally {
      this._photoChannel.close();
    }
  }
}
