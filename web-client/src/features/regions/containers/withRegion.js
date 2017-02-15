import {graphql} from 'react-apollo';
import {withProps, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import {Fragments} from '../queries';

const regionDetails = gql`
  query regionDetails($_id: ID!, $language:String, $withBounds: Boolean!, $withPOIs: Boolean!) {
    region(_id: $_id, language: $language) {
      ...RegionCore
      ...RegionPOIs @include(if: $withPOIs)
      ...RegionBounds @include(if: $withBounds)
    }
  }
  ${Fragments.Core}
  ${Fragments.POIs}
  ${Fragments.Bounds}
`;

/**
 *
 * @param options.withBounds (false) = Should include bounds
 * @param options.withPOIs (true) = Should include POIs
 * @param options.propName ('region') = Name of prop which will contain region
 * @returns High-order component
 */
export function withRegion(options) {
  const {withBounds = false, withPOIs = true, propName = 'region'} = options;
  return compose(
    withProps(({regionId, match, location}) => ({
      regionId: regionId || match.params.regionId || location.query.regionId
    })),
    graphql(
      regionDetails,
      {
        options: ({regionId, language}) => ({
          forceFetch: true,//i18n's problem with caching
          variables: {_id: regionId, language, withBounds, withPOIs},
        }),
        props: ({data: {region, loading}}) => {
          return {[propName]: region && filter(Fragments.All, region), regionLoading: loading}
        },
      }
    ),
  );
};