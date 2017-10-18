import { branch, compose, withProps } from 'recompose';
import { RegionDetails, RegionInput } from '../../../ww-commons';
import { WithNode, withSingleNode } from '../../apollo/withSingleNode';
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

export const withRegion = (options: WithRegionOptions = {}) => withSingleNode<'region', RegionDetails>({
  resourceType: 'region',
  alias: 'withRegion',
  query: REGION_DETAILS,
  newResource: NEW_REGION,
  ...options,
});

export type WithRegion = WithNode<'region', RegionDetails>;
