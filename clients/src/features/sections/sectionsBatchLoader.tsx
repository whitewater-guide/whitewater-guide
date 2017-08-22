import * as React from 'react';
import { ComponentType } from 'react';
import { WithSectionsList } from './withSectionsList';

/**
 * High order component that automatically loads all available sections in batches
 * @param batchSize - number of sections to load at once
 * @returns {SectionsBatchLoader}
 */
export const sectionsBatchLoader = (batchSize = 25) => (Wrapped: ComponentType<any>) => {
  return class SectionsBatchLoader extends React.PureComponent<WithSectionsList> {

    componentDidMount() {
      this.loadMoreSections(null);
    }

    componentDidUpdate(prevPros: WithSectionsList) {
      this.loadMoreSections(prevPros);
    }

    loadMoreSections = (prevPros: WithSectionsList | null) => {
      const { loadMore, list, count, loading } = this.props.sections;
      const numSections = list.length;
      const prevNumSections = prevPros ? prevPros.sections.list.length : 0;
      // Do not compare count like this: `prevNumSections < numSections`
      // Because when cache is starting to refresh, it is prevNumSections > numSections
      if (prevNumSections !== numSections && numSections < count && !loading) {
        loadMore({ startIndex: numSections, stopIndex: numSections + batchSize });
      }
    };

    render() {
      return (
        <Wrapped {...this.props} />
      );
    }
  };
};
