import * as React from 'react';
import { WithSectionsList } from './withSectionsList';

/**
 * High order component that automatically loads all available sections in batches
 * @param batchSize - number of sections to load at once
 * @returns {SectionsBatchLoader}
 */
export const sectionsBatchLoader = (batchSize = 25) => (Wrapped: React.ComponentType<any>) => {
  return class SectionsBatchLoader extends React.PureComponent<WithSectionsList> {

    componentDidMount() {
      this.loadMoreSections(null);
    }

    componentDidUpdate(prevPros: WithSectionsList) {
      this.loadMoreSections(prevPros);
    }

    loadMoreSections = (prevPros: WithSectionsList | null) => {
      const { nodes, count, loading, fetchMore } = this.props.sections;
      const numSections = nodes.length;
      const prevNumSections = prevPros ? prevPros.sections.nodes.length : 0;
      // Do not compare count like this: `prevNumSections < numSections`
      // Because when cache is starting to refresh, it is prevNumSections > numSections
      if (prevNumSections !== numSections && numSections < count && !loading) {
        // TODO: fixme arguments
        fetchMore({ startIndex: numSections, stopIndex: numSections + batchSize } as any);
      }
    };

    render() {
      return (
        <Wrapped {...this.props} />
      );
    }
  };
};
