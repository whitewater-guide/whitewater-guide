import React, {Component, PropTypes} from 'react';
import {Column, Table, AutoSizer, SortDirection} from 'react-virtualized';
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
            <Column label='Name' dataKey='name' width={100}/>
            <Column width={200} label='Difficulty' dataKey='difficulty'/>
          </Table>
        )}
      </AutoSizer>
    );
  }

  sort = ({sortBy, sortDirection}) => {
    this.setState({sortBy, sortDirection});
  };

}

export default SectionsTable;