import React, {Component, PropTypes} from 'react';
import {AutoSizer, SortDirection, InfiniteLoader} from 'react-virtualized';
import container from './ListSectionsContainer';
import SectionsTable from './SectionsTable';
import SectionsFilter from './SectionsFilter';

class ListSections extends Component {

  static propTypes = {
    sections: PropTypes.array,
    count: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
    onSort: PropTypes.func,
    onSearch: PropTypes.func,
    searchString: PropTypes.string,
    removeSection: PropTypes.func,
    loadMore: PropTypes.func.isRequired,
    push: PropTypes.func,
    showFilters: PropTypes.bool,
  };

  static defaultProps = {
    sections: [],
    sortBy: 'name',
    sortDirection: SortDirection.ASC,
    showFilters: true,
  };

  render() {
    const {admin, sections, count, loadMore, sortBy, sortDirection, onSort, onSearch, searchString} = this.props;
    return (
      <div style={styles.wrapper}>
        {this.props.showFilters && <SectionsFilter searchString={searchString} onSearch={onSearch}/>}
        <AutoSizer>
          {({width, height}) => (
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={loadMore}
              rowCount={count}
            >
              {({onRowsRendered, registerChild}) => (
                <SectionsTable
                  admin={admin}
                  sections={sections}
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

  isRowLoaded = ({index}) => !!this.props.sections[index];

  onSectionClick = (sectionId) => this.props.push(`/sections/${sectionId}`);

  onEditSection = (sectionId) => this.props.push(`/sections/${sectionId}/settings`);

  onDeleteSection = (sectionId) => this.props.removeSection(sectionId);

}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
};

export default container(ListSections);