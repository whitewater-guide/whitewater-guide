import { gql } from 'react-apollo';
import { branch, compose, withProps } from 'recompose';
import { Region } from '../../../ww-commons';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core';
import { RegionFragments } from './regionFraments';

const regionDetails = gql`
  query regionDetails($_id: ID!, $language:String, $withBounds: Boolean!, $withPOIs: Boolean!) {
    region(_id: $_id, language: $language) {
      ...RegionCore
      ...RegionDescription
      ...RegionPOIs @include(if: $withPOIs)
      ...RegionBounds @include(if: $withBounds)
    }
  }
  ${RegionFragments.Core}
  ${RegionFragments.Description}
  ${RegionFragments.POIs}
  ${RegionFragments.Bounds}
`;

export interface WithRegionOptions {
  withBounds?: boolean;
  withPOIs?: boolean;
  propName?: string;
}

export interface WithRegionChildProps {
  regionLoading: boolean;
  error?: any;
}

export interface WithRegionResult {
  region: Region | null;
}

export interface WithRegionProps {
  regionId?: string;
  language?: string;
}

/**
 *
 * @param options.withBounds (false) = Should include bounds
 * @param options.withPOIs (true) = Should include POIs
 * @param options.propName ('region') = Name of prop which will contain region
 * @returns High-order component
 */
export function withRegion<RegionProp = {region: Region | null}>(options: WithRegionOptions) {
  const { withBounds = false, withPOIs = true, propName = 'region' } = options;
  type ChildProps = WithRegionChildProps & RegionProp;
  return compose<WithRegionChildProps & ChildProps, any>(
    withFeatureIds('region'),
    // If no region was found, branch provides dummy region with error
    branch<WithRegionProps>(
      ({ regionId }) => !!regionId,
      enhancedQuery<WithRegionResult, WithRegionProps, ChildProps>(
        regionDetails,
        {
          options: ({ regionId, language }) => ({
            fetchPolicy: 'cache-and-network',
            variables: { id: regionId, language, withBounds, withPOIs },
          }),
          props: ({ data }) => {
            const { region, loading } = data!;
            return { [propName]: region, regionLoading: loading && !region };
          },
        },
      ),
      withProps<ChildProps, WithRegionProps>(({ regionId }) => ({
        [propName]: null,
        regionLoading: false,
        error: `No region with id ${regionId} was found`,
      } as any as ChildProps)),
    ),
  );
}

export type WithRegion<RegionProp = {region: Region | null}> = WithRegionProps & WithRegionChildProps & RegionProp;
