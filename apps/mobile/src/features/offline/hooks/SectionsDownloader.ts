import type { ApolloClient } from '@apollo/client';
import type { DocumentNode } from 'graphql';

import { PHOTO_SIZE_PX } from '~/features/media';

import type {
  ListSectionsQuery,
  ListSectionsQueryVariables,
} from '../offlineSections.generated';
import { ListSectionsDocument } from '../offlineSections.generated';
import type { OfflineProgress } from '../types';
import type { PhotoChannel } from '../utils';
import { extractPhotos } from '../utils';

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
    this._pageSize = opts.limit || 120;
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

    try {
      // Delete exising sections and start fresh
      this._client.cache.evict({
        id: 'ROOT_QUERY',
        fieldName: 'sections',
        broadcast: false,
        args: {
          filter: {
            regionId,
          },
        },
      });

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
        const photos = extractPhotos(data.sections.nodes.slice(offset));
        offset = data.sections.nodes.length;
        total = data.sections.count;
        this._onProgress({ data: [offset, total] });
        this._photoChannel.put(photos);
      }
    } catch (e) {
      this._photoChannel.break(e as Error);
      throw e;
    } finally {
      this._photoChannel.close();
    }
  }
}
