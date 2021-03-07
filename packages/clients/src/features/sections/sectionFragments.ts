import { NamedNode, Point, River, Section } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

import { GaugeFragments } from '../gauges';

const Name = gql`
  fragment SectionName on Section {
    id
    name
    altNames
    river {
      id
      name
      altNames
    }
  }
`;

export interface SectionName extends NamedNode {
  altNames: Section['altNames'];
  river: Pick<River, 'id' | 'name' | 'altNames'>;
}

const Core = gql`
  fragment SectionCore on Section {
    ...SectionName

    hidden
    helpNeeded
    demo
    verified

    season
    seasonNumeric

    distance
    drop
    duration
    difficulty
    difficultyXtra
    rating
  }
  ${Name}
`;

export type SectionCore = SectionName &
  Pick<
    Section,
    | 'hidden'
    | 'helpNeeded'
    | 'demo'
    | 'verified'
    | 'season'
    | 'seasonNumeric'
    | 'distance'
    | 'drop'
    | 'duration'
    | 'difficulty'
    | 'difficultyXtra'
    | 'rating'
  >;

const RegionId = gql`
  fragment SectionRegionId on Section {
    region {
      id
    }
  }
`;

export type SectionRegionId = { region: { __typename?: 'Region'; id: string } };

const Ends = gql`
  fragment SectionEnds on Section {
    putIn {
      id
      coordinates
      kind
    }
    takeOut {
      id
      coordinates
      kind
    }
  }
`;

export interface SectionEnds {
  putIn: Pick<Point, 'id' | 'coordinates' | 'kind'>;
  takeOut: Pick<Point, 'id' | 'coordinates' | 'kind'>;
}

const Shape = gql`
  fragment SectionShape on Section {
    shape
  }
`;

export type SectionShape = Pick<Section, 'shape'>;

const Description = gql`
  fragment SectionDescription on Section {
    description
  }
`;

export type SectionDescription = Pick<Section, 'description'>;

const GaugeBinding = {
  All: gql`
    fragment GaugeBindingAll on GaugeBinding {
      minimum
      maximum
      optimum
      impossible
      approximate
      formula
    }
  `,
};

const Measurements = gql`
  fragment SectionMeasurements on Section {
    gauge {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeLatestMeasurement
      source {
        id
        name
        termsOfUse
      }
    }
    levels {
      ...GaugeBindingAll
    }
    flows {
      ...GaugeBindingAll
    }
    flowsText
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.LatestMeasurement}
  ${GaugeFragments.Location}
  ${GaugeBinding.All}
`;

const Meta = gql`
  fragment SectionMeta on Section {
    createdAt
    updatedAt
  }
`;

export type SectionMeta = Pick<Section, 'createdAt' | 'updatedAt'>;

const MediaCore = (thumbWidth?: number, thumbHeight?: number) => {
  if (!thumbWidth && !thumbHeight) {
    return gql`
      fragment MediaCore on Media {
        id
        description
        url
        kind
        resolution
        size
        image
        copyright
        license {
          slug
          name
          url
        }
      }
    `;
  }
  const thumbParams: string[] = [];
  if (thumbWidth) {
    thumbParams.push(`width: ${thumbWidth}`);
  }
  if (thumbHeight) {
    thumbParams.push(`height: ${thumbHeight}`);
  }
  const thumbParamsStr = thumbParams.join(', ');
  return gql`
    fragment MediaCore on Media {
      id
      description
      url
      kind
      resolution
      size
      image
      thumb: image(${thumbParamsStr})
      copyright
      license {
        slug
        name
        url
      }
    }
  `;
};

const Media = (thumbWidth?: number, thumbHeight?: number) =>
  gql`
    fragment SectionMedia on Section {
      media {
        nodes {
          ...MediaCore
        }
        count
      }
    }
    ${MediaCore(thumbWidth, thumbHeight)}
  `;

const POIs = gql`
  fragment SectionPOIs on Section {
    pois {
      id
      name
      description
      coordinates
      kind
    }
  }
`;

export type SectionPOIs = Pick<Section, 'pois'>;

const Tags = gql`
  fragment SectionTags on Section {
    tags {
      id
      name
      category
    }
  }
`;

export type SectionTags = Pick<Section, 'tags'>;

const License = gql`
  fragment SectionLicense on Section {
    copyright
    license {
      slug
      name
      url
    }
  }
`;

export type SectionLicense = Pick<Section, 'copyright' | 'license'>;

export const SectionFragments = {
  Core,
  Description,
  Ends,
  GaugeBinding,
  License,
  Measurements,
  Media,
  Meta,
  Name,
  POIs,
  RegionId,
  Shape,
  Tags,
};

export const MediaFragments = {
  Core: MediaCore,
};
