import {
  ApolloClient,
  ApolloError,
  ApolloQueryResult,
  NetworkStatus,
  ObservableQuery,
} from '@apollo/client';
import React, { useContext } from 'react';

import {
  PollRegionMeasurementsDocument,
  PollRegionMeasurementsQueryVariables,
} from '../regions';
import { applySearch } from './applySearch';
import {
  ListedSectionFragment,
  ListSectionsDocument,
  ListSectionsQuery,
  ListSectionsQueryVariables,
} from './listSections.generated';
import { SectionFilterOptions, SectionsStatus } from './types';

export interface InnerState {
  sections: ListedSectionFragment[] | null;
  error: ApolloError | null;
  count: number;
  status: SectionsStatus;
}

export interface SectionsListContext extends InnerState {
  refresh: () => Promise<void>;
}

const SectionsListCtx = React.createContext<SectionsListContext>({
  count: 0,
  sections: null,
  error: null,
  status: SectionsStatus.READY,
  refresh: () => Promise.resolve(),
});

interface Props {
  filterOptions: SectionFilterOptions | null;
  regionId?: string | null;
  limit?: number | ((offset: number) => number);
  pollInterval?: number;
  isConnected: boolean | null;
  client: ApolloClient<any>;
}

export class SectionsListProvider extends React.PureComponent<
  Props,
  InnerState
> {
  static defaultProps: Partial<Props> = {
    limit: 20,
    pollInterval: 5 * 60 * 1000,
    isConnected: true,
  };

  _query!: ObservableQuery<ListSectionsQuery, ListSectionsQueryVariables>;

  _pollQuery!: ObservableQuery<any, PollRegionMeasurementsQueryVariables>;

  _subscription: ZenObservable.Subscription | undefined;

  _pollSub: ZenObservable.Subscription | undefined;

  _mounted = false;

  _lastUpdatedId?: string;

  constructor(props: Props) {
    super(props);
    const { client, regionId } = props;
    if (!regionId) {
      this.state = {
        sections: null,
        count: 0,
        error: null,
        status: SectionsStatus.READY,
      };
      return;
    }

    let fromCache: ListSectionsQuery | null = null;
    try {
      fromCache = client.readQuery({
        query: ListSectionsDocument,
        variables: { filter: { regionId } },
      });
    } catch (e) {
      /* ignore, not in cache */
    }
    this.state = {
      error: null,
      sections: fromCache?.sections?.nodes ?? null,
      count: fromCache?.sections?.count ?? 0,
      status: SectionsStatus.READY,
    };
    this._lastUpdatedId =
      (fromCache?.sections?.nodes?.length &&
        fromCache.sections.nodes[fromCache.sections.nodes.length - 1].id) ||
      undefined;

    this._query = client.watchQuery({
      query: ListSectionsDocument,
      fetchPolicy: 'cache-only', // to start loading manually
      variables: { filter: { regionId } },
    });
    this._subscription = this._query.subscribe(this.onUpdate, (error) => {
      this.setState({ error });
    });
  }

  async componentDidMount() {
    this._mounted = true;
    const { isConnected } = this.props;
    const { count, sections } = this.state;
    if (isConnected) {
      if (count === 0 || !sections || sections.length < count) {
        await this.loadInitial();
      } else {
        await this.loadUpdates();
      }
      await this.startPolling();
    }
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.isConnected && !prevProps.isConnected) {
      const { count, sections } = this.state;
      if (count === 0 || !sections || sections.length < count) {
        await this.loadInitial();
      } else {
        await this.loadUpdates();
      }
      await this.startPolling();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._pollSub) {
      this._pollSub.unsubscribe();
    }
    if (this._pollQuery) {
      this._pollQuery.stopPolling();
    }
  }

  onUpdate = (props: ApolloQueryResult<ListSectionsQuery>) => {
    const { data, networkStatus, error } = props;
    if (error) {
      this.setState({ error });
    }
    if (networkStatus !== NetworkStatus.ready) {
      return;
    }
    // Fetch more triggers update twice
    // https://github.com/apollographql/apollo-client/issues/3948
    const lastId =
      (data?.sections?.nodes?.length &&
        data.sections.nodes[data.sections.nodes.length - 1].id) ||
      undefined;
    if (lastId === this._lastUpdatedId && !this._pollQuery) {
      return;
    }
    this._lastUpdatedId = lastId;
    // this will happen when trying to read from cache when cache is empty
    if (!this._mounted || !data?.sections) {
      return;
    }
    this.setState({
      sections: data?.sections?.nodes as ListedSectionFragment[],
      count: data?.sections?.count ?? 0,
    });
  };

  /**
   * This will load sections in chunks
   * @param offset
   * @param updatedAfter
   */
  loadSections = async (offset = 0, updatedAfter?: Date) => {
    const { isConnected, regionId, limit } = this.props;
    const nLimit = typeof limit === 'function' ? limit(offset) : limit;
    if (!this._mounted || !regionId || !isConnected) {
      return;
    }
    // This is a hack to allow refetch, because cache-only won't allow it now
    this._query.options.fetchPolicy = 'cache-first';
    const { data, error } = await this._query.fetchMore({
      query: ListSectionsDocument,
      variables: {
        page: { limit: nLimit, offset },
        filter: { regionId, updatedAfter: updatedAfter?.toISOString() },
      },
    });

    if (error) {
      this.setState({ error });
    }

    if (!data?.sections) {
      return;
    }

    const { nodes, count } = data.sections;

    if (offset + nodes.length < count) {
      await this.loadSections(offset + nodes.length, updatedAfter);
    }
  };

  loadInitial = async () => {
    if (!this._mounted) {
      return;
    }
    this.setState({ status: SectionsStatus.LOADING, error: null });
    try {
      await this.loadSections(this.state.sections?.length);
    } catch (error: any) {
      if (this._mounted) {
        this.setState({ error });
      }
    } finally {
      if (this._mounted) {
        this.setState({ status: SectionsStatus.READY });
      }
    }
  };

  loadUpdates = async () => {
    if (!this._mounted) {
      return;
    }

    // get latest updated section
    const updatedAfter: Date | undefined = this.state.sections?.reduce(
      (acc, { updatedAt }) =>
        acc && acc > new Date(updatedAt ?? '')
          ? acc
          : new Date(updatedAt ?? ''),
      undefined as Date | undefined,
    );
    this.setState({ status: SectionsStatus.LOADING_UPDATES, error: null });
    try {
      await this.loadSections(0, updatedAfter);
    } catch (error: any) {
      if (this._mounted) {
        this.setState({ error });
      }
    } finally {
      if (this._mounted) {
        this.setState({ status: SectionsStatus.READY });
      }
    }
  };

  startPolling = async () => {
    const { client, regionId, pollInterval } = this.props;
    if (!regionId || !pollInterval) {
      return;
    }
    this._pollQuery = client.watchQuery({
      query: PollRegionMeasurementsDocument,
      variables: { regionId },
      pollInterval,
      fetchPolicy: 'network-only',
    });
    // startPolling uses setInterval internally, therefore query is not fetched immediately
    // https://github.com/apollographql/apollo-client/issues/4439
    await this._pollQuery.result();
    this._pollQuery.startPolling(pollInterval);
    this._pollSub = this._pollQuery.subscribe(() => {
      // it seems that dummy subscription is necessary to update main query
      // without this, some tests break
    });
  };

  refresh = async () => {
    const { sections, count, status } = this.state;
    if (!this._mounted || status !== SectionsStatus.READY) {
      return;
    }
    if (!sections || sections.length < count) {
      await this.loadInitial();
    } else {
      await this.loadUpdates();
    }
  };

  render() {
    const { filterOptions, children } = this.props;
    const { status, count, sections, error } = this.state;

    const filteredSections = sections
      ? applySearch(sections, filterOptions)
      : null;
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const value: SectionsListContext = {
      error,
      count,
      status,
      sections: filteredSections,
      refresh: this.refresh,
    };
    // Functional children is just ugly hack to make tests easier.
    // Never use them irl
    return (
      <SectionsListCtx.Provider value={value}>
        {typeof children === 'function' ? children(value) : children}
      </SectionsListCtx.Provider>
    );
  }
}

export const useSectionsList = () => useContext(SectionsListCtx);
