import { ApolloQueryResult, ObservableQuery } from 'apollo-client';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { withNetworkConnectivity } from 'react-native-offline';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { RootState } from '../../core/reducers';
import { getListMerger } from '../../ww-clients/apollo';
import { POLL_REGION_MEASUREMENTS, PollVars } from '../../ww-clients/features/regions';
import { LIST_SECTIONS, Result, Vars } from '../../ww-clients/features/sections';
import { applySearch, Section } from '../../ww-commons';
import { InnerProps, OuterProps, SectionsStatus } from './types';

interface ConnectivityProps {
  isConnected: boolean;
}

interface State {
  sections: Section[];
  count: number;
  status: SectionsStatus;
}

export type WrapperProps<P = any> = OuterProps & ConnectivityProps & WithApolloClient<P>;

// export for testing
export function sectionsListContainer(limit: number = 20, pollingInterval: number = 5 * 60 * 1000) {
  // tslint:disable-next-line:only-arrow-functions
  return function<P>(Wrapped: React.ComponentType<P & InnerProps>): React.ComponentType<WrapperProps<P>> {
    class WithSectionsList extends React.PureComponent<WrapperProps<P>, State> {
      _query!: ObservableQuery<Result, Vars>;
      _pollQuery!: ObservableQuery<any, PollVars>;
      _subscription: ZenObservable.Subscription | undefined;
      _mounted: boolean = false;

      constructor(props: WrapperProps<P>) {
        super(props);
        const { client, region  } = props;
        if (!region.node) {
          this.state = { sections: [], count: 0, status: SectionsStatus.READY };
          return;
        }

        let fromCache: Result | null = null;
        try {
          fromCache = client.readQuery<Result, Vars>({
            query: LIST_SECTIONS,
            variables: { filter: { regionId: region.node.id } },
          });
        } catch (e) {/* ignore, not in cache*/}
        this.state = {
          sections: fromCache ? fromCache.sections.nodes! : [],
          count: fromCache ? fromCache.sections.count! : 0,
          status: SectionsStatus.READY,
        };

        this._query = client.watchQuery<Result, Vars>({
          query: LIST_SECTIONS,
          fetchPolicy: 'cache-only', // set to cache-only so first time query is not fired
          variables: { filter: { regionId: region.node.id } },
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
      }

      async componentDidUpdate(prevProps: WrapperProps<P>) {
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

      onUpdate = ({ data }: ApolloQueryResult<Result>) => {
        // this will happen when trying to read from cache when cache is empty
        if (!this._mounted || !data.sections) {
          return;
        }
        this.setState({ sections: data.sections.nodes!, count: data.sections.count! });
      };

      /**
       * This will load sections in chunks
       * @param offset
       * @param updatedAfter
       */
      loadSections = async (offset: number = 0, updatedAfter?: Date) => {
        const { isConnected, region } = this.props;
        if (!this._mounted || !region.node || !isConnected) {
          return;
        }

        try {
          const { data } = await this._query.fetchMore({
            query: LIST_SECTIONS,
            variables: { page: { limit, offset }, filter: { regionId: region.node.id, updatedAfter } },
            updateQuery: getListMerger('sections') as any,
          });

          const { sections: { nodes, count } } = data;
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

        const { client, region } = this.props;
        if (!region.node || pollingInterval === 0) {
          return;
        }
        this._pollQuery = client.watchQuery<any, PollVars>({
          query: POLL_REGION_MEASUREMENTS,
          variables: { regionId: region.node.id },
        }) as any;
        this._pollQuery.startPolling(pollingInterval);
      };

      loadUpdates = async () => {
        if (!this._mounted) {
          return;
        }
        // get latest updated section
        const updatedAfter: Date | undefined = this.state.sections.reduce(
          (acc, { updatedAt }) => (acc && acc > new Date(updatedAt)) ? acc : new Date(updatedAt),
          undefined as (Date | undefined),
        );
        this.setState({ status: SectionsStatus.LOADING_UPDATES });
        await this.loadSections(0, updatedAfter);
        if (!this._mounted) {
          return;
        }
        this.setState({ status: SectionsStatus.READY });
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
        const { searchTerms, isConnected, client, ...props } = this.props as any;
        const { status, count, sections } = this.state;
        const filteredSections = applySearch(sections, searchTerms);
        return (
          <Wrapped
            {...props}
            status={status}
            count={count}
            sections={filteredSections}
            refresh={this.refresh}
          />
        );
      }
    }

    return WithSectionsList;
  };
}

const container = (pageSize: number = 20) => compose<InnerProps & OuterProps, OuterProps>(
  connect((state: RootState) => ({ isConnected: state.network.isConnected })),
  withApollo,
  sectionsListContainer(pageSize),
);

export default container;
