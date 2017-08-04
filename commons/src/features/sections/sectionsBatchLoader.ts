import React from 'react';
import { SectionsPropType } from './propTypes';

/**
 * High order component that automatically loads all available sections in batches
 * @param batchSize - number of sections to load at once
 * @returns {SectionsBatchLoader}
 */
export const sectionsBatchLoader = (batchSize = 25) => (Component) => {
  class SectionsBatchLoader extends React.PureComponent {
    static propTypes = {
      sections: SectionsPropType.isRequired,
    };

    componentDidMount() {
      this.loadMoreSections({ sections: { list: [] } });
    }

    componentDidUpdate(prevPros) {
      this.loadMoreSections(prevPros);
    }

    loadMoreSections = (prevPros) => {
      const { loadMore, list, count, loading } = this.props.sections;
      const numSections = list.length;
      const prevNumSections = prevPros.sections.list.length;
      // Do not compare count like this: `prevNumSections < numSections`
      // Because when cache is starting to refresh, it is prevNumSections > numSections
      if (prevNumSections !== numSections && numSections < count && !loading) {
        loadMore({ startIndex: numSections, stopIndex: numSections + batchSize });
      }
    };

    render() {
      return <Component {...this.props} />;
    }
  }

  return SectionsBatchLoader;
};
