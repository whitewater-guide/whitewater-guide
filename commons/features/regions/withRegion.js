import { gql, graphql } from 'react-apollo';
import { branch, compose, withProps } from 'recompose';
import { filter } from 'graphql-anywhere';
import { RegionFragments } from './regionFraments';
import { withFeatureIds } from '../../core/withFeatureIds';

const regionDetails = gql`
  query regionDetails($_id: ID!, $language:String, $withBounds: Boolean!, $withPOIs: Boolean!) {
    region(_id: $_id, language: $language) {
      ...RegionCore
      ...RegionPOIs @include(if: $withPOIs)
      ...RegionBounds @include(if: $withBounds)
      description
    }
  }
  ${RegionFragments.Core}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
`;

/**
 *
 * @param options.withBounds (false) = Should include bounds
 * @param options.withPOIs (true) = Should include POIs
 * @param options.propName ('region') = Name of prop which will contain region
 * @returns High-order component
 */
export function withRegion(options) {
  const { withBounds = false, withPOIs = true, propName = 'region' } = options;
  return compose(
    withFeatureIds('region'),
    // If no region was found, branch provides dummy region with error
    branch(
      ({ regionId }) => !!regionId,
      graphql(
        regionDetails,
        {
          options: ({ regionId, language }) => ({
            fetchPolicy: 'network-only', // i18n's problem with caching
            variables: { _id: regionId, language, withBounds, withPOIs },
          }),
          props: ({ data: { region, loading } }) => (
            { [propName]: region && filter(RegionFragments.All, region), regionLoading: loading }
          ),
        },
      ),
      withProps(({ regionId }) => ({
        [propName]: {},
        regionLoading: false,
        error: `No region with id ${regionId} was found`,
      })),
    ),
  );
}
