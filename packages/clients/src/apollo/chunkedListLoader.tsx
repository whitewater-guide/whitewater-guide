import React from 'react';
import { ListType } from '../../ww-commons';
import { WithList } from './types';

type ChunkedListProps<T extends ListType> = {
  [propName in T]: WithList<any>;
};

/**
 * High order component that automatically loads all available list nodes in chunks
 * @returns {HOC}
 */
export const chunkedListLoader = <T extends ListType>(propName: T) =>
  (Wrapped: React.ComponentType<ChunkedListProps<T>>) => {
    return class SectionsBatchLoader extends React.PureComponent<ChunkedListProps<T>> {

      componentDidMount() {
        const { [propName]: list } = this.props as any;
        if (list.nodes && list.nodes.length === 0) {
          this.fetchMore().catch(/* Ignore */);
        }
      }

      componentDidUpdate(prevProps: ChunkedListProps<T>) {
        const prevList: WithList<T> = prevProps[propName];
        const nextList: WithList<T> = (this.props as any)[propName];
        if (nextList.nodes.length !== prevList.nodes.length) {
          this.fetchMore().catch(/* Ignore */);
        }
      }

      fetchMore = async () => {
        const { [propName]: list } = this.props as any;
        return list.fetchMore();
      };

      render() {
        return (
          <Wrapped {...this.props} />
      );
      }
    };
  };
