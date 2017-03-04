import React, {Component, PropTypes} from 'react';
import {Column, Table, AutoSizer, SortDirection, InfiniteLoader} from 'react-virtualized';
import {Rating} from '../../core/forms';
import {Durations} from './Durations';
import {AdminControls, rowRenderer} from '../../core/components';
import {renderDifficulty} from '../../utils/TextUtils';
import _ from 'lodash';
import container from './ListSectionsContainer';

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

  durationsMap = _.keyBy(Durations, 'value');

  render() {
    const {admin, sections, count, loadMore} = this.props;
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
                <Table
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  width={width}
                  height={height}
                  headerHeight={20}
                  rowHeight={30}
                  rowCount={sections.length}
                  rowGetter={({index}) => sections[index]}
                  sortBy={this.props.sortBy}
                  sortDirection={this.props.sortDirection}
                  sort={this.props.onSort}
                  onRowClick={this.onRowClick}
                  rowStyle={this.styleRow}
                  rowRenderer={rowRenderer}
                >
                  <Column width={200} flexGrow={1} label='Name' dataKey="name" cellDataGetter={this.renderName}/>
                  <Column width={110} label='Difficulty' dataKey="difficulty" cellDataGetter={this.difficultyRenderer}/>
                  <Column width={130} label='Rating' dataKey="rating" cellRenderer={this.renderRating}/>
                  <Column width={80} label='Drop (m)' dataKey="drop"/>
                  <Column width={80} label='Length' dataKey="distance"/>
                  <Column width={80} label='Duration' dataKey="duration" cellDataGetter={({rowData}) => _.get(this.durationsMap, [rowData.duration, 'slug'])}/>
                  {admin && <Column width={90} dataKey="controls" label="Controls" cellRenderer={this.renderControls}/>}
                </Table>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    );
  }

  isRowLoaded = ({ index }) => {
    return !!this.props.sections[index];
  };

  renderName = ({rowData}) => {
    return `${rowData.river.name} - ${rowData.name}`;
  };

  difficultyRenderer = ({rowData}) => {
    return renderDifficulty(rowData);
  };

  renderRating = ({rowData}) => {
    const field = {value: rowData.rating};
    return (
      <Rating field={field} style={styles.rating}/>
    );
  };

  renderControls = ({rowData}) => {
    const editHandler = () => this.props.push(`/sections/${rowData._id}/settings`);
    const deleteHandler = () => this.props.removeSection(rowData._id);
    return (
      <AdminControls onEdit={editHandler} onDelete={deleteHandler}/>
    );
  };

  onRowClick = ({index}) => this.props.push(`/sections/${this.props.sections[index]._id}`);

  styleRow = ({index}) => {
    return {

    }
  };

}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  rating: {
    minWidth: 10,
  },
};

export default container(ListSections);