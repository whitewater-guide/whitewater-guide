import { branch, compose, withProps } from 'recompose';
import { HarvestMode, Source, SourceInput } from '../../../ww-commons';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core';
import { ScriptsList, withScriptsList } from '../scripts';
import REGION_DETAILS from './sourceDetails.query';

export const NEW_SOURCE: SourceInput = {
  id: null,
  name: '',
  termsOfUse: null,
  script: '',
  cron: null,
  harvestMode: HarvestMode.ONE_BY_ONE,
  enabled: false,
  url: null,
};

export interface WithSourceOptions {
  errorOnMissingId?: boolean;
  includeScripts?: boolean;
}

export interface WithSourceChildProps {
  scripts?: ScriptsList;
  source: {
    data: Source | null;
    loading: boolean;
  };
  errors: {
    [key: string]: {[key: string]: any};
  };
}

export interface WithSourceResult {
  source: Source | null;
}

export interface WithSourceProps {
  sourceId?: string;
  language?: string;
}

/**
 *
 * @param options.errorOnMissingId (true) = Should error be added if sourceId is not found?
 * @param options.includeScripts (false) = Should also request scripts?
 * @returns High-order component
 */
export function withSource(options: WithSourceOptions = {}) {
  const { errorOnMissingId = true, includeScripts } = options;
  return compose<WithSourceChildProps, any>(
    withFeatureIds('source'),
    includeScripts ? withScriptsList : ((i: any) => i),
    // If no source was found, branch provides dummy source with error
    branch<WithSourceProps>(
      ({ sourceId }) => !!sourceId,
      enhancedQuery<WithSourceResult, WithSourceProps, WithSourceChildProps>(
        REGION_DETAILS,
        {
          options: ({ sourceId, language }) => ({
            fetchPolicy: 'cache-and-network',
            variables: { id: sourceId, language },
          }),
          props: ({ data }) => {
            const { source, loading } = data!;
            return {
              source: {
                data: source,
                loading: loading && !source,
              },
            };
          },
          alias: 'withSource',
        },
      ),
      withProps<WithSourceChildProps, WithSourceProps>(({ sourceId }) => (
        {
          source: {
            data: NEW_SOURCE as any,
            loading: false,
          },
          errors: errorOnMissingId ? {
            sourceDetails: { message: `No source with id ${sourceId} was found` },
          } : {},
        }
      )),
    ),
  );
}

export type WithSource = WithSourceProps & WithSourceChildProps;
