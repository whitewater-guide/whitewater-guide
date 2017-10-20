import * as update from 'immutability-helper';
import { defaults, flow, maxBy, noop, pick } from 'lodash';
import { map, reject } from 'lodash/fp';
import { gql } from 'react-apollo';
import { connect } from 'react-redux';
import { branch, compose, mapProps } from 'recompose';
import {
  Section,
  SectionSearchTermInput,
  SectionSearchTerms,
  SelectableTag,
  SelectableTagInput,
  TagSelection,
} from '../../../ww-commons';
import { enhancedQuery, FetchMoreResult } from '../../apollo';
import { withFeatureIds } from '../../core';
import { searchTermsSelector } from '../regions';
import { SectionFragments } from './sectionFragments';

const ListSectionsQuery = gql`
  query listSections(
    $terms: SectionSearchTerms!,
    $language: String,
    $skip: Int,
    $limit: Int,
    $withGeo: Boolean!,
    $isLoadMore:Boolean!
  ) {
    sections(terms:$terms, language:$language, skip: $skip, limit: $limit) {
      sections {
        ...SectionCore
        ...SectionMeasurements
        ...SectionEnds @include(if: $withGeo)
        updatedAt
      }
      count @skip(if: $isLoadMore)
    }
  }
  ${SectionFragments.Measurements}
  ${SectionFragments.Core}
  ${SectionFragments.Ends}
`;

const UpdatesSubscription = gql`
  subscription measurementsUpdated($regionId: ID!){
    measurementsUpdated(regionId: $regionId){
      _id
      levels {
        lastTimestamp
        lastValue
      }
      flows {
        lastTimestamp
        lastValue
      }
    }
  }
`;

interface Result {
  sections: {
    sections: Section[];
    count?: number;
  };
}

interface Props {
  language?: string;
  regionId?: string;
  searchTerms: SectionSearchTerms;
}

export interface WithSectionsList {
  sections: {
    list: Section[];
    count: number;
    loading: boolean;
    loadMore: (args: { startIndex: number, stopIndex: number }) => void;
    loadUpdates: () => void;
    subscribeToUpdates: (sub: { regionId?: string }) => void;
  };
}

/**
 * Transforms client-side search terms to search terms that will be send in graphql query
 */
function serializeSearchTerms(
  terms: SectionSearchTerms,
  regionId?: string,
  offlineSearch?: boolean,
): SectionSearchTermInput {
  const termsToSend: SectionSearchTerms = offlineSearch ?
    pick(terms, ['sortBy', 'sortDirection', 'riverId', 'searchString']) as any :
    terms;
  return {
    ...termsToSend,
    regionId,
  };
}

const mergeNextPage = (prevResult: Result, { fetchMoreResult }: FetchMoreResult<Result>) => {
  if (!fetchMoreResult.sections) {
    return prevResult;
  }
  const newSections = fetchMoreResult.sections.sections;
  return update(prevResult, {
    sections: { sections: { $push: newSections } },
  });
};

const mergeListUpdates = (prevResult: Result) => {
  // TODO: what if new sections were added - should do proper merge
  return prevResult;
};

interface Options {
  withGeo?: boolean;
  pageSize?: number;
  offlineSearch?: boolean;
}

const sectionsGraphql = ({ withGeo, pageSize, offlineSearch }: Options) =>
  enhancedQuery<Result, Props, WithSectionsList>(
  ListSectionsQuery,
  {
    options: ({ language, regionId, searchTerms }) => ({
      fetchPolicy: 'cache-first',
      variables: {
        terms: serializeSearchTerms(searchTerms, regionId, offlineSearch),
        limit: pageSize,
        skip: 0,
        withGeo,
        language,
        isLoadMore: false,
      },
      // TODO: replace reducer with update
      // reducer: sectionsListReducer,
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data }) => {
      const { sections: sectionsSearchResult, loading, variables, fetchMore, subscribeToMore } = data!;
      const { sections = [], count = 0 } = sectionsSearchResult || {};
      const result: WithSectionsList = {
        sections: {
          list: sections,
          count,
          loading: loading && !sections,
          loadMore: ({ startIndex: skip, stopIndex }) => fetchMore({
            variables: { skip, limit: stopIndex - skip, isLoadMore: true },
            updateQuery: mergeNextPage,
          }),
          loadUpdates: () => {
            const latest = maxBy(sections, 'updatedAt');
            let vars;
            if (latest) {
              const updatedAt = new Date(latest.updatedAt).valueOf();
              vars = { ...variables, isLoadMore: false, terms: { ...variables.terms, updatedAt } };
            } else  {
              vars = { ...variables, isLoadMore: false };
            }
            fetchMore({
              variables: vars,
              updateQuery: mergeListUpdates,
            });
          },
          subscribeToUpdates: ({ regionId }) => subscribeToMore({
            document: UpdatesSubscription,
            variables: { regionId },
            onError: error => console.log(`Subscription error ${error}`),
          }),
        },
      };
      return result;
    },
  },
);

const localFilter = mapProps(({ sortBy, sortDirection, searchString, sections, ...props }) => {
  const sort = sortBy === 'name' ? [(sec: Section) => sec.river.name, 'name'] : [sortBy];
  let sortedSections = sections;
  if (searchString) {
    const regex = new RegExp(searchString, 'i');
    sortedSections = sortedSections.filter((s: Section) => regex.test(s.name) || regex.test(s.river.name));
  }
  sortedSections = sortBy(sortedSections, sort);
  if (sortDirection.toLowerCase() === 'desc') {
    sortedSections = sortedSections.reverse();
  }
  return {
    sortBy,
    sortDirection,
    sections: sortedSections,
    sectionsCount: sections.length,
    loadMore: noop,
    ...props,
  };
});

type TagSerializer = (tags: SelectableTag[]) => SelectableTagInput[];

const serializeTags: TagSerializer = flow(
  reject<Partial<SelectableTag>, SelectableTag>({ selection: TagSelection.NONE }),
  map<SelectableTag, SelectableTagInput>(
    ({ id, selection }: SelectableTag) => ({ id, selection: selection === TagSelection.SELECTED ? 1 : -1 }),
  ),
);

/**
 * High-order component that provides list of sections with optional sort and remove capabilities
 * @param options.withGeo (false) - should sections include put-in and take-out coordinates?
 * @param options.pageSize (25) - Number of sections per page;
 * @param options.offlineSearch - If true, search options will not be sent in graphql request
 *
 * @returns High order component with following props:
 *          searchTerms
 *          riverId
 *          regionId
 *          sections: {
 *            list
 *            count
 *            loading
 *            loadMore function({ startIndex, stopIndex })
 *          }
 *
 */
export function withSectionsList(options: Options) {
  const opts = defaults({}, options, { withGeo: false, pageSize: 25, offlineSearch: false });
  return compose<WithSectionsList, any>(
    withFeatureIds(['region', 'river']),
    connect(searchTermsSelector),
    mapProps(({ searchTerms, ...props }) => ({
      ...props,
      searchTerms: {
        ...searchTerms,
        kayakingTags: serializeTags(searchTerms.kayakingTags),
        hazardsTags: serializeTags(searchTerms.hazardsTags),
        miscTags: serializeTags(searchTerms.miscTags),
        supplyTags: serializeTags(searchTerms.supplyTags),
      },
    })),
    branch<{sections: any}>(
      // If sections aren't provided from outside, fetch them
      props => !props.sections,
      sectionsGraphql(opts),
      // If sections are provided from outside - sort manually on client
      localFilter,
    ),
  );
}
