import { AuthenticationRequiredError, ContextUser, ForbiddenError } from '@apollo';
import db from '@db';
import { BaseModel, FieldsMap, ManyBuilderOptions } from '@db/model';
import { Media } from '@ww-commons';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';
import { MediaRaw } from './types';

const CHECK_MEDIA_QUERY = `
  WITH media_found AS (
      SELECT exists(SELECT 1
                    FROM media
                    WHERE media.id = :id) AS found
  )
  SELECT
    media_found.found,
    CASE WHEN media_found.found THEN
      :id
    ELSE
      uuid_generate_v1mc()
    END AS id
  FROM media_found
`;

const FIELDS_MAP: FieldsMap<Media, MediaRaw> = {};

interface GetManyOptions extends ManyBuilderOptions<MediaRaw> {
  sectionId: string;
}

interface MediaCheckResult {
  // True if media exists in db
  found: boolean;
  // media id (new, just generated if found == false or existing if found == true)
  id: string;
}

export class MediaConnector extends BaseModel<Media, MediaRaw> {

  constructor(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
    super(user, language, fieldsByType);
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
    query.whereExists(function(this: QueryBuilder) {
      this.select('*').from('sections_media')
        .where({ section_id: sectionId })
        .whereRaw('media_view.id = sections_media.media_id');
    });
    return query;
  }

  async assertEditorPermissions(id?: string, sectionId?: string) {
    if (!this._user) {
      throw new AuthenticationRequiredError();
    }
    if (this._user.admin) {
      return true;
    }
    let query: QueryBuilder;
    if (!id && !sectionId) {
      // New media form, any editor is allowed to create it
      query = db().select('region_id').from('regions_editors').where({ user_id: this._user.id });
    } else {
      query = db().select('rivers.region_id').from('sections')
        .innerJoin('rivers', 'sections.river_id', '=', 'rivers.id')
        .innerJoin('regions_editors', 'rivers.region_id', '=', 'regions_editors.region_id')
        .where({ user_id: this._user.id });
      if (sectionId) {
        query.where('sections.id', sectionId);
      } else if (id) {
        query.innerJoin('sections_media', 'sections.id', '=', 'sections_media.section_id')
          .where({ media_id: id });
      }
    }

    const { rows: [{ exists }] } = await db().raw(`SELECT EXISTS (${query.toString()})`);
    if (!exists) {
      throw new ForbiddenError();
    }
    return true;
  }

  /**
   * Checks if media with this id exists, return its id
   * If not exists, generates new id and returns it
   * @param {string | null} mediaId
   * @returns {Promise<{found: boolean; id: string}>}
   */
  async checkMediaId(mediaId?: string | null): Promise<MediaCheckResult>  {
    const result = await db().raw(CHECK_MEDIA_QUERY, { id: (mediaId || null) as any });
    const [{ found, id }] = result.rows;
    return { found, id };
  }
}
