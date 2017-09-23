import { branch, compose, withProps } from 'recompose';
import { RegionDetails, RegionInput } from '../../../ww-commons';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core';
import REGION_DETAILS from './regionDetails.query';

export const NEW_REGION: RegionInput = {
  id: null,
  hidden: false,
  description: null,
  bounds: null,
  seasonNumeric: [],
  season: null,
  name: '',
  pois: [],
};

export interface WithRegionOptions {
  errorOnMissingId?: boolean;
}

export interface WithRegionChildProps {
  region: {
    data: RegionDetails | null;
    loading: boolean;
  };
  errors: {
    [key: string]: {[key: string]: any};
  };
}

export interface WithRegionResult {
  region: RegionDetails | null;
}

export interface WithRegionProps {
  regionId?: string;
  language?: string;
}

/**
 *
 * @param options.errorOnMissingId (true) = Should error be added if regionId is not found?
 * @returns High-order component
 */
export function withRegion(options: WithRegionOptions = {}) {
  const { errorOnMissingId = true } = options;
  return compose<WithRegionChildProps, any>(
    withFeatureIds('region'),
    // If no region was found, branch provides dummy region with error
    branch<WithRegionProps>(
      ({ regionId }) => !!regionId,
      enhancedQuery<WithRegionResult, WithRegionProps, WithRegionChildProps>(
        REGION_DETAILS,
        {
          options: ({ regionId, language }) => ({
            fetchPolicy: 'cache-and-network',
            variables: { id: regionId, language },
          }),
          props: ({ data }) => {
            const { region, loading } = data!;
            return {
              region: {
                data: region,
                loading: loading && !region,
              },
            };
          },
          alias: 'withRegion',
        },
      ),
      withProps<WithRegionChildProps, WithRegionProps>(({ regionId }) => (
        {
          region: {
            data: NEW_REGION as any, // it is not valid from TS point of view
            loading: false,
          },
          errors: errorOnMissingId ? {
            regionDetails: { message: `No region with id ${regionId} was found` },
          } : {},
        }
      )),
    ),
  );
}

export type WithRegion = WithRegionProps & WithRegionChildProps;
