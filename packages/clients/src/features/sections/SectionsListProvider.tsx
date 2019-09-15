import {
  applySearch,
  Section,
  SectionSearchTerms,
} from '@whitewater-guide/commons';
import ApolloClient, {
  ApolloQueryResult,
  NetworkStatus,
  ObservableQuery,
} from 'apollo-client';
import React, { useContext } from 'react';
import { getListMerger } from '../../apollo';
import { POLL_REGION_MEASUREMENTS, PollVars } from '../regions';
import {
  LIST_SECTIONS,
  ListSectionsResult,
  ListSectionsVars,
} from './listSections.query';
import { SectionsStatus } from './types';

export interface InnerState {
  sections: Section[];
  count: number;
  status: SectionsStatus;
}

export interface SectionsListContext extends InnerState {
  refresh: () => Promise<void>;
}

export const SectionsListContext = React.createContext<SectionsListContext>({
  count: 0,
  sections: [],
  status: SectionsStatus.READY,
  refresh: () => Promise.resolve(),
});

interface Props {
  searchTerms: SectionSearchTerms | null;
  regionId?: string | null;
  limit?: number;
  pollInterval?: number;
  isConnected: boolean;
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

  _query!: ObservableQuery<ListSectionsResult, ListSectionsVars>;
  _pollQuery!: ObservableQuery<any, PollVars>;
  _subscription: ZenObservable.Subscription | undefined;
  _mounted: boolean = false;
  _lastUpdatedId?: string;

  constructor(props: Props) {
    super(props);
    const { client, regionId } = props;
    if (!regionId) {
      this.state = { sections: [], count: 0, status: SectionsStatus.READY };
      return;
    }

    let fromCache: ListSectionsResult | null = null;
    try {
      fromCache = client.readQuery({
        query: LIST_SECTIONS,
        variables: { filter: { regionId } },
      });
    } catch (e) {
      /* ignore, not in cache*/
    }
    this.state = {
      sections: fromCache ? fromCache.sections.nodes! : [],
      count: fromCache ? fromCache.sections.count! : 0,
      status: SectionsStatus.READY,
    };
    this._lastUpdatedId =
      (fromCache &&
        fromCache.sections &&
        fromCache.sections.nodes.length &&
        fromCache.sections.nodes[fromCache.sections.nodes.length - 1].id) ||
      undefined;

    this._query = client.watchQuery({
      query: LIST_SECTIONS,
      fetchPolicy: 'cache-only', // to start loading manually
      variables: { filter: { regionId } },
      fetchResults: false,
    });
    this._subscription = this._query.subscribe(this.onUpdate);
  }

  async componentDidMount() {
    this._mounted = true;
    const { isConnected } = this.props;
    const { count, sections } = this.state;
    if (count === 0 || sections.length < count) {
      await this.loadInitial();
    } else {
      await this.loadUpdates();
    }
    if (isConnected) {
      await this.startPolling();
    }
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.isConnected && !prevProps.isConnected) {
      const { count, sections } = this.state;
      if (count === 0 || sections.length < count) {
        await this.loadInitial();
      }
      await this.startPolling();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._pollQuery) {
      this._pollQuery.stopPolling();
    }
  }

  onUpdate = (props: ApolloQueryResult<ListSectionsResult>) => {
    const { data, networkStatus } = props;
    if (networkStatus !== NetworkStatus.ready) {
      return;
    }
    // Fetch more triggers update twice
    // https://github.com/apollographql/apollo-client/issues/3948
    const lastId =
      (data.sections &&
        data.sections.nodes.length &&
        data.sections.nodes[data.sections.nodes.length - 1].id) ||
      undefined;
    if (lastId === this._lastUpdatedId && !this._pollQuery) {
      return;
    }
    this._lastUpdatedId = lastId;
    // this will happen when trying to read from cache when cache is empty
    if (!this._mounted || !data.sections) {
      return;
    }
    this.setState({
      sections: data.sections.nodes!,
      count: data.sections.count!,
    });
  };

  /**
   * This will load sections in chunks
   * @param offset
   * @param updatedAfter
   */
  loadSections = async (offset: number = 0, updatedAfter?: Date) => {
    const { isConnected, regionId, limit } = this.props;
    if (!this._mounted || !regionId || !isConnected) {
      return;
    }
    // This is a hack to allow refetch, because cache-only won't allow it now
    this._query.options.fetchPolicy = 'cache-first';
    try {
      const { data } = await this._query.fetchMore({
        query: LIST_SECTIONS,
        variables: {
          page: { limit, offset },
          filter: { regionId, updatedAfter },
        },
        updateQuery: getListMerger('sections') as any,
      });

      const {
        sections: { nodes, count },
      } = data;
      if (offset + nodes!.length < count!) {
        await this.loadSections(offset + nodes!.length, updatedAfter);
      }
    } catch (e) {
      // Ignore
    }
  };

  loadInitial = async () => {
    if (!this._mounted) {
      return;
    }
    this.setState({ status: SectionsStatus.LOADING });
    await this.loadSections(this.state.sections.length);
    if (!this._mounted) {
      return;
    }
    this.setState({ status: SectionsStatus.READY });
  };

  loadUpdates = async () => {
    if (!this._mounted) {
      return;
    }
    // get latest updated section
    const updatedAfter: Date | undefined = this.state.sections.reduce(
      (acc, { updatedAt }) =>
        acc && acc > new Date(updatedAt) ? acc : new Date(updatedAt),
      undefined as (Date | undefined),
    );
    this.setState({ status: SectionsStatus.LOADING_UPDATES });
    await this.loadSections(0, updatedAfter);
    if (!this._mounted) {
      return;
    }
    this.setState({ status: SectionsStatus.READY });
  };

  startPolling = async () => {
    const { client, regionId, pollInterval } = this.props;
    if (!regionId || !pollInterval) {
      return;
    }
    this._pollQuery = client.watchQuery({
      query: POLL_REGION_MEASUREMENTS,
      variables: { regionId },
      pollInterval,
      fetchPolicy: 'network-only',
    });
    // startPolling uses setInterval internally, therefore query is not fetched immediately
    // https://github.com/apollographql/apollo-client/issues/4439
    await this._pollQuery.result();
    await this._pollQuery.startPolling(pollInterval);
  };

  refresh = async () => {
    const { sections, count, status } = this.state;
    if (!this._mounted || status !== SectionsStatus.READY) {
      return;
    }
    if (sections.length < count) {
      await this.loadInitial();
    } else {
      await this.loadUpdates();
    }
  };

  render() {
    const { searchTerms, children } = this.props;
    const { status, count, sections } = this.state;
    const filteredSections = applySearch(sections, searchTerms);
    const value = {
      count,
      status,
      sections: filteredSections,
      refresh: this.refresh,
    };
    return (
      <SectionsListContext.Provider value={value}>
        {typeof children === 'function' ? children(value) : children}
      </SectionsListContext.Provider>
    );
  }
}

export const useSectionsList = () => useContext(SectionsListContext);
