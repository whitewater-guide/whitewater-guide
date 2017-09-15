import { branch, compose, withProps } from 'recompose';
import { Region, RegionInput } from '../../../ww-commons';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core';
import REGION_DETAILS from './regionDetails.query';

const NEW_REGION: RegionInput = {
  id: null,
  hidden: false,
  description: null,
  bounds: [],
  seasonNumeric: [],
  season: null,
  name: '',
  pois: [],
};

export interface WithRegionOptions {
  withBounds?: boolean;
  withPOIs?: boolean;
  propName?: string;
  errorOnMissingId?: boolean;
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
 * @param options.propName ('region') = Name of prop which will contain region
 * @param options.errorOnMissingId (true) = Should error be added if regionId is not found?
 * @returns High-order component
 */
export function withRegion<RegionProp = {region: Region | null}>(options: WithRegionOptions) {
  const { propName = 'region', errorOnMissingId = true } = options || {};
  type ChildProps = WithRegionChildProps & RegionProp;
  return compose<WithRegionChildProps & ChildProps, any>(
    withFeatureIds('region'),
    // If no region was found, branch provides dummy region with error
    branch<WithRegionProps>(
      ({ regionId }) => !!regionId,
      enhancedQuery<WithRegionResult, WithRegionProps, ChildProps>(
        REGION_DETAILS,
        {
          options: ({ regionId, language }) => ({
            fetchPolicy: 'cache-and-network',
            variables: { id: regionId, language },
          }),
          props: ({ data }) => {
            const { region, loading } = data!;
            return { [propName]: region, regionLoading: loading && !region };
          },
          alias: 'withRegion',
        },
      ),
      withProps<ChildProps, WithRegionProps>(({ regionId }) => ({
        [propName]: NEW_REGION,
        regionLoading: false,
        error: errorOnMissingId ? `No region with id ${regionId} was found` : undefined,
      } as any as ChildProps)),
    ),
  );
}

export type WithRegion<RegionProp = {region: Region | null}> = WithRegionProps & WithRegionChildProps & RegionProp;
