import React, {Component, PropTypes} from 'react';
import {Column, Table, AutoSizer, SortDirection} from 'react-virtualized';
import Rating from '../../forms/Rating';
import {Durations} from '/imports/api/sections';
import {renderDifficulty} from '../../../utils/TextUtils';
import _ from 'lodash';

class SectionsTable extends Component {

  static propTypes = {
    sections: PropTypes.array,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
    onSort: PropTypes.func,
  };

  static defaultProps = {
    sections: [],
    sortBy: 'name',
    sortDirection: SortDirection.ASC,
  };

  durationsMap = _.keyBy(Durations, 'value');

  render() {
    const {sections} = this.props;
    // let sortedSections = _.sortBy(sections, this.props.sortBy);
    // if (this.props.sortDirection === SortDirection.DESC)
    //   sortedSections = _.reverse(sortedSections);
    return (
      <AutoSizer>
        {({width, height}) => (
          <Table
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={30}
            rowCount={sections.length}
            rowGetter={({index}) => sections[index]}
            sortBy={this.props.sortBy}
            sortDirection={this.props.sortDirection}
            sort={this.props.onSort}
          >
            <Column label='Name' dataKey="name" width={300} cellDataGetter={this.renderName}/>
            <Column width={110} label='Difficulty' dataKey="difficulty" cellDataGetter={this.renderDifficulty}/>
            <Column width={130} label='Rating' dataKey="rating" cellRenderer={this.renderRating}/>
            <Column width={80} label='Drop (m)' dataKey="drop"/>
            <Column width={80} label='Length' dataKey="distance"/>
            <Column width={80} label='Duration' dataKey="duration" cellDataGetter={({rowData}) => _.get(this.durationsMap, [rowData.duration, 'slug'])}/>
          </Table>
        )}
      </AutoSizer>
    );
  }

  renderName = ({rowData}) => {
    return `${rowData.riverName} - ${rowData.name}`;
  };

  renderDifficulty = ({rowData}) => {
    return renderDifficulty(rowData);
  };

  renderRating = ({rowData}) => {
    const field = {value: rowData.rating};
    return (
      <Rating field={field} style={styles.rating}/>
    );
  };

}

const styles = {
  rating: {
    minWidth: 10,
  },
};

export default SectionsTable;