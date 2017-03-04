import React, {Component, PropTypes} from 'react';
import {AutoSizer, SortDirection, InfiniteLoader} from 'react-virtualized';
import container from './ListSectionsContainer';
import SectionsTable from './SectionsTable';

class ListSections extends Component {

  static propTypes = {
    sections: PropTypes.array,
    count: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
    onSort: PropTypes.func,
    removeSection: PropTypes.func,
    loadMore: PropTypes.func.isRequired,
    push: PropTypes.func,
  };

  static defaultProps = {
    sections: [],
    sortBy: 'name',
    sortDirection: SortDirection.ASC,
  };

  render() {
    const {admin, sections, count, loadMore, sortBy, sortDirection, onSort} = this.props;
    return (
      <div style={styles.wrapper}>
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