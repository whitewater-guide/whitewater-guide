import { branch, compose, withProps } from 'recompose';
import { HarvestMode, Source, SourceInput } from '../../../ww-commons';
import { WithNode, withSingleNode } from '../../apollo';
import SOURCE_DETAILS from './sourceDetails.query';

export const NEW_SOURCE: SourceInput = {
  id: null,
  name: '',
  termsOfUse: null,
  script: '',
  cron: null,
  harvestMode: HarvestMode.ONE_BY_ONE,
  enabled: false,
  url: null,
  regions: [],
};

export interface WithSourceOptions {
  errorOnMissingId?: boolean;
}

export const withSource = (options: WithSourceOptions) => withSingleNode<'source', Source>({
  resourceType: 'source',
  alias: 'withSource',
  query: SOURCE_DETAILS,
  newResource: NEW_SOURCE,
  ...options,
});

export type WithSource = WithNode<'source', Source>;
