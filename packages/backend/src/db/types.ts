import { BannerKind } from '@whitewater-guide/schema';
/* eslint-disable @typescript-eslint/no-namespace */
// Types of raw postgres tables and views
export namespace Sql {
  export type UUID = string;

  export type Lang = 'en' | 'ru' | 'es' | 'de' | 'fr' | 'pt' | 'it';
  export type MediaKind = 'blog' | 'photo' | 'video';
  export type PlatformType = 'ios' | 'android' | 'boomstarter';
  export type TagCategory = 'kayaking' | 'hazards' | 'supply' | 'misc';

  export interface Timestamped {
    created_at: Date;
    updated_at: Date;
  }

  export interface Translation extends Timestamped {
    language: Lang;
  }

  export interface Translated {
    default_lang: Lang;
  }

  export interface Accounts<TTokens = unknown, TProfile = unknown>
    extends Timestamped {
    user_id: UUID;
    provider: string;
    id: string;
    username: string;
    tokens: TTokens | null;
    profile: TProfile | null;
  }

  export interface BannersGroups {
    banner_id: UUID;
    group_id: UUID;
  }

  export interface BannersRegions {
    banner_id: UUID;
    region_id: UUID;
  }

  export interface BannerSource {
    kind: BannerKind;
    url: string;
  }

  export interface Banners<TExtras = unknown> {
    id: UUID;
    name: string;
    slug: string;
    priority: number;
    enabled: boolean;
    placement: string;
    source: BannerSource;
    link: string | null;
    extras: TExtras | null;
  }

  export interface BoomPromos {
    code: string;
    redeemed: boolean;
    group_sku: string | null;
  }

  export interface Descents extends Timestamped {
    id: UUID;
    ord_id: number;
    parent_id: UUID | null;
    user_id: UUID | null;
    section_id: UUID;
    comment: string | null;
    started_at: Date;
    duration: number | null;
    level_value: number | null;
    level_unit: string | null;
    public: boolean;
  }

  export interface FcmTokens {
    user_id: UUID;
    token: string;
  }

  export interface Gauges<TRequestParams = unknown>
    extends Timestamped,
      Translated {
    id: UUID;
    source_id: UUID;
    location_id: UUID | null;
    code: string;
    level_unit: string | null;
    flow_unit: string | null;
    request_params: TRequestParams | null;
    url: string | null;
  }

  export interface GaugesTranslations extends Translation {
    gauge_id: UUID;
    name: string;
  }

  export type GaugesView<TRequestParams = unknown> = Gauges<TRequestParams> &
    Omit<GaugesTranslations, 'gauge_id'> & {
      enabled: boolean;
      script: string;
      location: PointsView | null;
    };

  export interface Groups extends Timestamped {
    id: UUID;
    sku: string | null;
    all_regions: boolean;
  }

  export interface GroupsTranslations extends Translation, Timestamped {
    group_id: UUID;
    name: string;
  }

  export type GroupsView = Groups & Omit<GroupsTranslations, 'group_id'>;

  export interface JobsView<TOptions = unknown> {
    id: UUID;
    cron: string | null;
    script: string | null;
    options: TOptions | null;
    gauges: { [gaugeCode: string]: unknown | null } | null;
  }

  export interface Media<TLicense = unknown> extends Timestamped, Translated {
    id: UUID;
    kind: MediaKind;
    url: string;
    resolution: [number, number] | null;
    weight: number;
    created_by: UUID | null;
    size: number;
    license: TLicense | null;
  }

  export interface MediaTranslations extends Translation, Timestamped {
    media_id: UUID;
    description: string | null;
    copyright: string | null;
  }

  export type MediaView<TLicense = unknown> = Media<TLicense> &
    Omit<MediaTranslations, 'media_id' | 'default_lang'>;

  export interface Points extends Translated {
    id: UUID;
    kind: string;
    coordinates: unknown;
    premium: boolean;
  }

  export interface PointsTranslations extends Translation, Timestamped {
    point_id: UUID;
    name: string | null;
    description: string | null;
  }

  export type PointsView = Omit<Points, 'coordinates'> &
    Omit<PointsTranslations, 'point_id' | 'default_lang'> & {
      coordinates: {
        type: 'Point';
        coordinates: [number, number, number];
      };
    };

  export interface RegionsEditors {
    user_id: UUID;
    region_id: UUID;
  }

  export interface RegionsGroups {
    group_id: UUID;
    region_id: UUID;
  }

  export interface RegionsPoints {
    point_id: UUID;
    region_id: UUID;
  }

  export interface RegionCoverImage {
    mobile?: string | null;
  }

  export interface Regions<TLicense = unknown> extends Timestamped, Translated {
    id: UUID;
    hidden: boolean | null;
    premium: boolean | null;
    sku: string | null;
    season_numeric: number[];
    bounds: unknown;
    cover_image: RegionCoverImage;
    maps_size: number;
    license: TLicense | null;
  }

  export interface RegionsTranslations extends Translation, Timestamped {
    region_id: UUID;
    name: string;
    description: string | null;
    season: string | null;
    copyright: string | null;
  }

  export type RegionsView<TLicense = unknown> = Omit<
    Regions<TLicense>,
    'bounds'
  > &
    Omit<RegionsTranslations, 'region_id' | 'default_lang'> & {
      bounds: {
        type: 'Polygon';
        coordinates: Array<Array<[number, number, number]>>;
      };
      pois: PointsView[] | null;
    };

  export interface Rivers extends Translated, Timestamped {
    id: UUID;
    region_id: UUID;
    created_by: UUID | null;
    import_id: string | null;
  }

  export interface RiversTranslations extends Translation, Timestamped {
    river_id: UUID;
    name: string;
    alt_names: string[];
  }

  export type RiversView = Rivers &
    Omit<RiversTranslations, 'river_id' | 'default_lang'> & {
      region: RegionsView;
    };

  export interface SectionsEditLog {
    id: UUID;
    section_id: UUID;
    section_name: string;
    river_id: UUID;
    river_name: string;
    region_id: UUID;
    region_name: string;
    editor_id: UUID;
    action: string;
    diff: unknown | null;
    created_at: Date | null;
  }

  export interface SectionsMedia {
    media_id: UUID;
    section_id: UUID;
  }

  export interface SectionsPoints {
    point_id: UUID;
    section_id: UUID;
  }

  export interface SectionsTags {
    tag_id: string;
    section_id: UUID;
  }

  export interface GaugeBinding {
    minimum: number | null | undefined;
    optimum: number | null | undefined;
    maximum: number | null | undefined;
    impossible: number | null | undefined;
    approximate: boolean | null | undefined;
    formula: string | null | undefined;
  }
  export interface Sections<TLicense = unknown>
    extends Translated,
      Timestamped {
    id: UUID;
    river_id: UUID;
    gauge_id: UUID | null;
    season_numeric: number[];
    levels: GaugeBinding | null;
    flows: GaugeBinding | null;
    shape: unknown | null;
    distance: number | null;
    drop: number | null;
    duration: number | null;
    difficulty: number | null;
    difficulty_xtra: string | null;
    rating: number | null;
    created_by: UUID | null;
    demo: boolean;
    hidden: boolean;
    import_id: string | null;
    help_needed: string | null;
    verified: boolean | null;
    license: TLicense | null;
  }

  export interface SectionsTranslations extends Translation, Timestamped {
    section_id: UUID;
    name: string;
    alt_names: string[];
    description: string | null;
    season: string | null;
    flows_text: string | null;
    copyright: string | null;
  }

  export type SectionsView<TLicense = unknown> = Omit<
    Sections<TLicense>,
    'shape'
  > &
    Omit<SectionsTranslations, 'section_id' | 'default_lang'> & {
      shape: {
        type: 'LineString';
        coordinates: Array<[number, number, number]>;
      };
      put_in: {
        type: 'Point';
        coordinates: [number, number, number];
      };
      take_out: {
        type: 'Point';
        coordinates: [number, number, number];
      };
      river_name: string;
      region_id: UUID;
      region_name: string;
      premium: boolean | null;
      pois: PointsView[] | null;
      tags: TagsView[] | null;
    };

  export interface SourcesRegions {
    source_id: UUID;
    region_id: UUID;
  }

  export interface Sources<TRequestParams = unknown>
    extends Timestamped,
      Translated {
    id: UUID;
    script: string;
    cron: string | null;
    url: string | null;
    request_params: TRequestParams | null;
  }

  export interface SourcesTranslations extends Translation, Timestamped {
    source_id: UUID;
    name: string;
    terms_of_use: string | null;
  }

  export type SourcesView<TRequestParams = unknown> = Sources<TRequestParams> &
    Omit<SourcesTranslations, 'source_id' | 'default_lang'>;

  export interface Suggestions {
    id: UUID;
    status: string;
    created_by: UUID | null;
    created_at: Date;
    resolved_by: UUID | null;
    resolved_at: Date | null;
    section_id: UUID;
    description: string | null;
    copyright: string | null;
    filename: string | null;
    resolution: [number, number] | null;
  }

  export interface Tags {
    id: string;
    category: TagCategory;
  }

  export interface TagsTranslations extends Translation {
    tag_id: string;
    name: string;
  }

  export type TagsView = Tags & Omit<TagsTranslations, 'tag_id'>;

  export interface TokensBlacklist {
    token: string;
    created_at: Date | null;
  }

  export interface Transactions<TExtra = unknown> extends Timestamped {
    id: UUID;
    user_id: UUID | null;
    platform: PlatformType;
    transaction_date: Date | null;
    transaction_id: string;
    product_id: string;
    receipt: string | null;
    validated: boolean | null;
    extra: TExtra | null;
  }

  export interface Users<TEditorSettings = unknown> extends Timestamped {
    id: UUID;
    name: string;
    avatar: string | null;
    email: string | null;
    admin: boolean;
    editor_settings: TEditorSettings | null;
    language: Lang;
    imperial: boolean;
    password: string | null;
    verified: boolean;
    tokens: Array<{ claim: string; expires: number; value: string }>;
  }
}
