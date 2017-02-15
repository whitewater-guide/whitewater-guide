import gql from 'graphql-tag';

const Named = gql`
  fragment NamedFragment on INamed {
    _id
    name
  }
`;

export const Fragments = {
  Named,
};