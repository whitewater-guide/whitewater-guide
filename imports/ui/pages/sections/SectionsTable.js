import React, {Component, PropTypes} from 'react';
import {Column, Table, AutoSizer, SortDirection} from 'react-virtualized';
import Rating from '../../forms/Rating';
import {renderDifficulty} from '../../../utils/TextUtils';
import _ from 'lodash';

class SectionsTable extends Component {

  static propTypes = {
    sections: PropTypes.array,
    numSections: PropTypes.number,
  };

  static defaultProps = {
    sections: [],
    numSections: 0,
  };

  state = {
    sortBy: 'name',
    sortDirection: SortDirection.ASC,
  };

  render() {
    const {sections, numSections} = this.props;
    let sortedSections = _.sortBy(sections, this.state.sortBy);
    if (this.state.sortDirection === SortDirection.DESC)
      sortedSections = _.reverse(sortedSections);
    return (
      <AutoSizer>
        {({width, height}) => (
          <Table
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={30}
            rowCount={sortedSections.length}
            rowGetter={({index}) => sortedSections[index]}
            sortBy={this.state.sortBy}
            sortDirection={this.state.sortDirection}
            sort={this.sort}
          >
            <Column label='Name' dataKey="name" width={300} cellDataGetter={this.renderName}/>
            <Column width={110} label='Difficulty' dataKey="difficulty" cellDataGetter={this.renderDifficulty}/>
            <Column width={130} label='Rating' dataKey="rating" cellRenderer={this.renderRating}/>
            <Column width={80} label='Drop (m)' dataKey="drop"/>
            <Column width={80} label='Length' dataKey="distance"/>
            <Column width={80} label='Duration' dataKey="duration"/>
          </Table>
        )}
      </AutoSizer>
    );
  }

  renderName = ({cellData, dataKey, rowData}) => {
    return `${rowData.riverName} - ${rowData.name}`;
  };

  renderDifficulty = ({cellData, dataKey, rowData}) => {
    return renderDifficulty(rowData);
  };

  renderRating = ({cellData, dataKey, rowData}) => {
    const field = {value: rowData.rating};
    return (
      <Rating field={field} style={styles.rating}/>
    );
  };

  sort = ({sortBy, sortDirection}) => {
    this.setState({sortBy, sortDirection});
  };

}

const styles = {
  rating: {
    minWidth: 10,
  },
};

export default SectionsTable;