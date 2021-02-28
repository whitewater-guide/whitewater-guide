import { Media, MediaInput, MediaKind } from '@whitewater-guide/commons';
import { UserInputError } from 'apollo-server-koa';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';

import db from '~/db';
import {
  FieldsMap,
  ManyBuilderOptions,
  OffsetConnector,
} from '~/db/connectors';
import { rawUpsert } from '~/db/rawUpsert';
import log from '~/log';
import { MEDIA, s3Client, TEMP } from '~/s3';

import { MediaRaw } from './types';
import { insertLog, logDiffer } from './utils';

const FIELDS_MAP: FieldsMap<Media, MediaRaw> = {
  deleted: null,
  image: null,
};

interface GetManyOptions extends ManyBuilderOptions<MediaRaw> {
  sectionId: string;
}

export class MediaConnector extends OffsetConnector<Media, MediaRaw> {
  constructor() {
    super();
    this._tableName = 'media_view';
    this._graphqlTypeName = 'Media';
    this._fieldsMap = FIELDS_MAP;
    this._orderBy = [
      { column: 'weight', direction: 'desc' },
      { column: 'created_at', direction: 'desc' },
    ];
  }

  getMany(info: GraphQLResolveInfo, { sectionId, ...options }: GetManyOptions) {
    const query = super.getMany(info, options);
    query.whereExists(function (this: QueryBuilder) {
      this.select('*')
        .from('sections_media')
        .where({ section_id: sectionId })
        .whereRaw('media_view.id = sections_media.media_id');
    });
    return query;
  }

  async upsertSectionMedia(
    input: MediaInput,
    sectionId: string,
    userId?: string,
  ) {
    if (!this._user) {
      throw new Error('user not defined');
    }
    let size = 0;
    let url = input.url;
    if (input.kind === MediaKind.photo) {
      url = s3Client.getLocalFileName(input.url) || url;
      try {
        const stat = await s3Client.statObject(TEMP, url);
        size = stat.ContentLength ?? 0;
      } catch (e) {
        log.error({
          message: 'Failed to get temp file size',
          error: e,
          extra: { media: input },
        });
      }
    }
    const media = {
      ...input,
      url,
      createdBy: userId || (this._user ? this._user.id : null),
      size,
    };
    const oldMedia = await this.getById(media.id);
    try {
      let upsertedId = await rawUpsert(
        db(),
        'SELECT upsert_section_media(?, ?, ?)',
        [sectionId, media, this._language],
      );
      upsertedId = upsertedId || media.id; // in case of update upsertedId will be null
      const [result] = await db()
        .select('*')
        .from('media_view')
        .andWhere({ id: upsertedId, language: this._language });
      // TODO: when creating video thumbs, image_file table column should be created
      // it'll be used for video thumbs and for original photo files
      await s3Client.moveTempImage(result.url, MEDIA);
      await insertLog(db(), {
        language: this._language || 'en',
        sectionId,
        action: !oldMedia ? 'media_create' : 'media_update',
        diff: oldMedia && logDiffer.diff(oldMedia, result),
        editorId: this._user.id,
      });
      return result;
    } catch (err) {
      // foreign_key_violation - non-existing section id
      if (
        err.code === '23503' &&
        err.constraint === 'sections_media_section_id_foreign'
      ) {
        throw new UserInputError('Invalid section id');
      }
      // unique_violation - trying assign media to different section
      // breaks media * --- 1 section relation (many to one)
      if (
        err.code === '23505' &&
        err.constraint === 'sections_media_media_id_unique'
      ) {
        throw new UserInputError('Invalid section id');
      }
      throw err;
    }
  }
}
