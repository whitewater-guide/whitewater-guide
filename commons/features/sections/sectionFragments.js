import { gql } from 'react-apollo';

const Name = gql`
  fragment SectionName on Section {
    name
    river {
      name
    }
  }
`;

const Core = gql`
  fragment SectionCore on Section {
    _id
    name
    season
    seasonNumeric

    river {
      _id
      name
    }

    region {
      _id
    }

    distance
    drop
    duration
    difficulty
    difficultyXtra
    rating
  }
`;

const Ends = gql`
  fragment SectionEnds on Section {
    putIn {
      _id
      coordinates
      kind
    }
    takeOut {
      _id
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
    lastTimestamp
    lastValue
  }
`};

const Measurements = gql`
  fragment SectionMeasurements on Section {
    gauge {
      _id
      levelUnit
      flowUnit
    }
    levels {
      ...GaugeBindingAll
    }
    flows {
      ...GaugeBindingAll
    }
  }
  ${GaugeBinding.All}
`;

const Meta = gql`
  fragment SectionMeta on Section {
    createdAt
    createdBy
    updatedAt
  }
`;

const MediaCore = gql`
  fragment MediaCore on Media {
    _id
    description
    copyright
    url
    type
  }
`;

const Media = gql`
  fragment SectionMedia on Section {
    media {
      ...MediaCore
    }
  }
  ${MediaCore}
`;

const POIs = gql`
  fragment SectionPOIs on Section {
    pois {
      _id
      name
      description
      coordinates
      kind
    }
  }
`;

const Tags = gql`
  fragment SectionTags on Section {
    supplyTags {
      _id
      name
    }
    kayakingTags {
      _id
      name
    }
    hazardsTags {
      _id
      name
    }
    miscTags {
      _id
      name
    }
  }
`;

// TODO: remove when https://github.com/apollographql/graphql-anywhere/issues/38 is resolved
const All = gql`
  fragment SectionAll on Section {
    ...SectionCore
    ...SectionDescription
    ...SectionEnds
    ...SectionShape
    ...SectionMeasurements
    ...SectionMedia
    ...SectionMeta
    ...SectionPOIs
    ...SectionTags
  }
  ${GaugeBinding.All}
  ${Core}
  ${Description}
  ${Ends}
  ${Shape}
  ${Measurements}
  ${Media}
  ${Meta}
  ${POIs}
  ${Tags}
`;

export const SectionFragments = {
  All,
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
