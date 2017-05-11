import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AutoSizer, InfiniteLoader } from 'react-virtualized';
import container from './ListSectionsContainer';
import SectionsTable from './SectionsTable';
import SectionsFilter from './SectionsFilter';

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
};

class ListSections extends Component {

  static propTypes = {
    admin: PropTypes.bool.isRequired,
    sectionSearchTerms: PropTypes.object.isRequired,
    updateSectionSearchTerms: PropTypes.func.isRequired,
    removeSection: PropTypes.func,
    history: PropTypes.object,
    showFilters: PropTypes.bool,
    sections: PropTypes.shape({
      list: PropTypes.array,
      count: PropTypes.number,
      loading: PropTypes.bool,
      loadMore: PropTypes.func,
    }),
  };

  static defaultProps = {
    sections: [],
    showFilters: true,
  };

  onDeleteSection = sectionId => this.props.removeSection(sectionId);

  onEditSection = sectionId => this.props.history.push(`/sections/${sectionId}/settings`);

  onSectionClick = sectionId => this.props.history.push(`/sections/${sectionId}`);

  onSearch = searchString => this.props.updateSectionSearchTerms({ searchString });

  onSort = sortSettings => this.props.updateSectionSearchTerms(sortSettings);

  isRowLoaded = ({ index }) => !!this.props.sections.list[index];

  loadMoreRows = (params) => {
    const { loading, loadMore } = this.props.sections;
    return loading ? Promise.resolve() : loadMore(params);
  };

  render() {
    const { admin, sections, sectionSearchTerms } = this.props;
    const { sortBy, sortDirection, searchString } = sectionSearchTerms;
    const { list, count } = sections;
    return (
      <div style={styles.wrapper}>
        {this.props.showFilters && <SectionsFilter searchString={searchString} onSearch={this.onSearch} />}
        <AutoSizer>
          {({ width, height }) => (
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.loadMoreRows}
              rowCount={count}
            >
              {({ onRowsRendered, registerChild }) => (
                <SectionsTable
                  admin={admin}
                  sections={list}
                  onRowsRendered={onRowsRendered}
                  registerChild={registerChild}
                  width={width}
                  height={height}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  sort={this.onSort}
                  onEditSection={this.onEditSection}
                  onDeleteSection={this.onDeleteSection}
                  onSectionClick={this.onSectionClick}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default container(ListSections);
