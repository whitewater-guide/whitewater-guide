import React from 'react';
import { SectionsPropType } from './propTypes';

/**
 * High order component that automatically loads all available sections in batches
 * @param Component
 * @returns {SectionsBatchLoader}
 */
export function sectionsBatchLoader(Component) {
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
      if (prevNumSections < numSections && numSections < count && !loading) {
        loadMore({ startIndex: numSections, stopIndex: numSections + 25 });
      }
    };

    render() {
      return <Component {...this.props} />;
    }
  }

  return SectionsBatchLoader;
}
