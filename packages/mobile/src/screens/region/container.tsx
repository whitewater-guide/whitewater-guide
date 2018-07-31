import { ApolloQueryResult, ObservableQuery } from 'apollo-client';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { withNetworkConnectivity } from 'react-native-offline';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { RootState } from '../../core/reducers';
import { getListMerger } from '../../ww-clients/apollo';
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

type WrapperProps<P> = OuterProps & ConnectivityProps & WithApolloClient<P>;

function container(limit: number = 20) {
  // tslint:disable-next-line:only-arrow-functions
  return function<P>(Wrapped: React.ComponentType<P & InnerProps>): React.ComponentType<P & OuterProps> {
    class WithRegionSections extends React.PureComponent<WrapperProps<P>, State> {
      _query!: ObservableQuery<Result, Vars>;
      _subscription!: ZenObservable.Subscription;

      constructor(props: WrapperProps<P>) {
        super(props);
        const { client, region  } = props;
        if (!region.node) {
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
          fetchPolicy: 'cache-only',
          variables: { filter: { regionId: region.node.id } },
        });
        this._subscription = this._query.subscribe(this.onUpdate);
      }

      async componentDidMount() {
        const { count, sections } = this.state;
        if (count === 0 || sections.length < count) {
          await this.loadInitial();
        } else {
          await this.loadUpdates();
        }
        // TODO: start polling
      }

      componentWillUnmount() {
        this._subscription.unsubscribe();
      }

      onUpdate = ({ data }: ApolloQueryResult<Result>) => {
        // this will happen when trying to read from cache when cache is empty
        if (!data.sections) {
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
        if (!region.node) {
          return;
        }
        if (!isConnected) {
          return;
        }

        const { data } = await this._query.fetchMore({
          query: LIST_SECTIONS,
          variables: {  page: { limit, offset }, filter: { regionId: region.node.id, updatedAfter } },
          updateQuery: getListMerger('sections') as any,
        });

        const { sections: { nodes, count } } = data;
        if (offset + nodes!.length < count!) {
          await this.loadSections(offset + nodes!.length, updatedAfter);
        }
      };

      loadInitial = async () => {
        this.setState({ status: SectionsStatus.LOADING });
        await this.loadSections(this.state.sections.length);
        this.setState({ status: SectionsStatus.READY });
      };

      loadUpdates = async () => {
        // get latest updated section
        const updatedAfter: Date | undefined = this.state.sections.reduce(
          (acc, { updatedAt }) => (acc && acc > new Date(updatedAt)) ? acc : new Date(updatedAt),
          undefined as (Date | undefined),
        );
        this.setState({ status: SectionsStatus.LOADING_UPDATES });
        this.loadSections(0, updatedAfter);
        this.setState({ status: SectionsStatus.READY });
      };

      refresh = () => {
        const { sections, count, status } = this.state;
        if (status !== SectionsStatus.READY) {
          return;
        }
        if (sections.length < count) {
          this.loadInitial();
        } else {
          this.loadUpdates();
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

    return compose<WrapperProps<P>, OuterProps & P>(
      connect((state: RootState) => ({ isConnected: state.network.isConnected })),
      withApollo,
    )(WithRegionSections);
  };
}

export default container;
