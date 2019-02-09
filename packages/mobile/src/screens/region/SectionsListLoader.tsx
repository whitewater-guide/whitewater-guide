import {
  getListMerger,
  LIST_SECTIONS,
  POLL_REGION_MEASUREMENTS,
  PollVars,
  RegionContext,
  Result,
  Vars,
} from '@whitewater-guide/clients';
import { applySearch } from '@whitewater-guide/commons';
import {
  ApolloQueryResult,
  NetworkStatus,
  ObservableQuery,
} from 'apollo-client';
import React from 'react';
import { WithApolloClient } from 'react-apollo';
import {
  ConnectivityProps,
  InnerState,
  RenderProps,
  SectionsStatus,
} from './types';

interface OwnProps {
  limit?: number;
  pollInterval?: number;
  children: (props: RenderProps) => any;
}

export type Props = Pick<RegionContext, 'region' | 'searchTerms'> &
  OwnProps &
  ConnectivityProps &
  WithApolloClient<any>;

export class SectionsListLoader extends React.PureComponent<Props, InnerState> {
  static defaultProps: Partial<Props> = {
    limit: 20,
    pollInterval: 5 * 60 * 1000,
  };

  _query!: ObservableQuery<Result, Vars>;
  _pollQuery!: ObservableQuery<any, PollVars>;
  _subscription: ZenObservable.Subscription | undefined;
  _mounted: boolean = false;
  _lastUpdatedId?: string;

  constructor(props: Props) {
    super(props);
    const { client, region } = props;
    if (!region.node) {
      this.state = { sections: [], count: 0, status: SectionsStatus.READY };
      return;
    }

    let fromCache: Result | null = null;
    try {
      fromCache = client.readQuery({
        query: LIST_SECTIONS,
        variables: { filter: { regionId: region.node.id } },
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
      fetchPolicy: 'cache-only',
      variables: { filter: { regionId: region.node.id } },
      fetchResults: false,
    });
    this._subscription = this._query.subscribe(this.onUpdate);
  }

  async componentDidMount() {
    this._mounted = true;
    const { count, sections } = this.state;
    if (count === 0 || sections.length < count) {
      await this.loadInitial();
    } else {
      await this.loadUpdates();
    }
    await this.startPolling();
  }

  async componentDidUpdate(prevProps: Props, prevState: any) {
    if (this.props.isConnected && !prevProps.isConnected) {
      const { count, sections } = this.state;
      if (count === 0 || sections.length < count) {
        await this.loadInitial();
      }
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

  onUpdate = (props: ApolloQueryResult<Result>) => {
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
    const { isConnected, region, limit } = this.props;
    if (!this._mounted || !region.node || !isConnected) {
      return;
    }

    try {
      const { data } = await this._query.fetchMore({
        query: LIST_SECTIONS,
        variables: {
          page: { limit, offset },
          filter: { regionId: region.node.id, updatedAfter },
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
    const { client, region, pollInterval } = this.props;
    if (!region.node || pollInterval === 0) {
      return;
    }
    this._pollQuery = client.watchQuery({
      query: POLL_REGION_MEASUREMENTS,
      variables: { regionId: region.node.id },
      pollInterval,
      fetchPolicy: 'network-only',
    });
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
    const { searchTerms } = this.props;
    const children: (props: RenderProps) => any = this.props.children as any;
    const { status, count, sections } = this.state;
    const filteredSections = applySearch(sections, searchTerms);
    return children({
      count,
      status,
      sections: filteredSections,
      refresh: this.refresh,
    });
  }
}
