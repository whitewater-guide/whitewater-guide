import React, { Component, PropTypes } from 'react';
import { AutoSizer, SortDirection, InfiniteLoader } from 'react-virtualized';
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
    sortBy: PropTypes.string,
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
    onSort: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchString: PropTypes.string,
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
    sortBy: 'name',
    sortDirection: SortDirection.ASC,
    showFilters: true,
    searchString: '',
  };

  onDeleteSection = sectionId => this.props.removeSection(sectionId);

  onEditSection = sectionId => this.props.history.push(`/sections/${sectionId}/settings`);

  onSectionClick = sectionId => this.props.history.push(`/sections/${sectionId}`);

  isRowLoaded = ({ index }) => !!this.props.sections.list[index];

  loadMoreRows = (params) => {
    const { loading, loadMore } = this.props.sections;
    return loading ? Promise.resolve() : loadMore(params);
  };

  render() {
    const { admin, sections, sortBy, sortDirection, onSort, onSearch, searchString } = this.props;
    const { list, count } = sections;
    return (
      <div style={styles.wrapper}>
        {this.props.showFilters && <SectionsFilter searchString={searchString} onSearch={onSearch} />}
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
                  sort={onSort}
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
