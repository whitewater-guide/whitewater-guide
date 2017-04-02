import { gql } from 'react-apollo';

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

const Geo = gql`
  fragment SectionGeo on Section {
    putIn {
      _id
      coordinates
      altitude
    }
    takeOut {
      _id
      coordinates
      altitude
    }
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

const Media = gql`
  fragment SectionMedia on Section {
    media {
      _id
      description
      copyright
      url
      type
    }
  }
`;

const POIs = gql`
  fragment SectionPOIs on Section {
    pois {
      _id
      name
      description
      coordinates
      altitude
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

//TODO: remove when https://github.com/apollographql/graphql-anywhere/issues/38 is resolved
const All = gql`
  fragment SectionAll on Section {
    ...SectionCore
    ...SectionDescription
    ...SectionGeo
    ...SectionMeasurements
    ...SectionMedia
    ...SectionMeta
    ...SectionPOIs
    ...SectionTags
    description
  }
  ${GaugeBinding.All}
  ${Core}
  ${Description}
  ${Geo}
  ${Measurements}
  ${Media}
  ${Meta}
  ${POIs}
  ${Tags}
`;

export const SectionFragments = {
  All,
  Core,
  Description,
  GaugeBinding,
  Geo,
  Measurements,
  Media,
  Meta,
  POIs,
  Tags,
};