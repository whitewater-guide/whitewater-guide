import gql from 'graphql-tag';
import { GaugeFragments } from '../gauges';

const Name = gql`
  fragment SectionName on Section {
    id
    name
    language
    altNames
    river {
      id
      language
      name
      altNames
    }
  }
`;

const Core = gql`
  fragment SectionCore on Section {
    ...SectionName

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

const Shape = gql`
  fragment SectionShape on Section {
    shape
  }
`;

const Description = gql`
  fragment SectionDescription on Section {
    description
  }
`;

const GaugeBinding = {All: gql`
  fragment GaugeBindingAll on GaugeBinding {
    minimum
    maximum
    optimum
    impossible
    approximate
  }
`};

const Measurements = gql`
  fragment SectionMeasurements on Section {
    gauge {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeLastMeasurement
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
  ${GaugeFragments.LastMeasurement}
  ${GaugeFragments.Location}
  ${GaugeBinding.All}
`;

const Meta = gql`
  fragment SectionMeta on Section {
    createdAt
    updatedAt
  }
`;

const MediaCore = gql`
  fragment MediaCore on Media {
    id
    language
    description
    copyright
    url
    kind
  }
`;

const Media = gql`
  fragment SectionMedia on Section {
    media {
      nodes {
        ...MediaCore
      }
      count
    }
  }
  ${MediaCore}
`;

const POIs = gql`
  fragment SectionPOIs on Section {
    pois {
      id
      language
      name
      description
      coordinates
      kind
    }
  }
`;

const Tags = gql`
  fragment SectionTags on Section {
    tags {
      id
      language
      name
      category
    }
  }
`;

export const SectionFragments = {
  Name,
  Core,
  Description,
  GaugeBinding,
  Ends,
  Shape,
  Measurements,
  Media,
  Meta,
  POIs,
  Tags,
};

export const MediaFragments = {
  Core: MediaCore,
};
