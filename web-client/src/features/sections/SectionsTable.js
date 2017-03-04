import React, {PropTypes} from 'react';
import {Column, Table} from 'react-virtualized';
import {AdminControls, rowRenderer} from '../../core/components';
import {Rating} from '../../core/forms';
import {renderDifficulty} from '../../utils/TextUtils';
import {Durations} from './Durations';
import _ from 'lodash';

const durationsMap = _.keyBy(Durations, 'value');

export default class SectionsTable extends React.Component {
  static propTypes = {
    sections: PropTypes.array,
    admin: PropTypes.bool,
    onEditSection: PropTypes.func,
    onDeleteSection: PropTypes.func,
    onSectionClick: PropTypes.func,
    registerChild: PropTypes.func,
  };

  render() {
    const {admin, sections = [], ...props} = this.props;
    return (
      <Table
        headerHeight={20}
        rowHeight={30}
        rowCount={sections.length}
        rowGetter={({index}) => sections[index]}
        onRowClick={this.onRowClick}
        rowRenderer={rowRenderer}
        ref={this.props.registerChild}
        {...props}
      >
        <Column width={200} flexGrow={1} label='Name' dataKey="name" cellDataGetter={this.renderName}/>
        <Column width={110} label='Difficulty' dataKey="difficulty" cellDataGetter={this.difficultyRenderer}/>
        <Column width={130} label='Rating' dataKey="rating" cellRenderer={this.renderRating}/>
        <Column width={80} label='Drop (m)' dataKey="drop"/>
        <Column width={80} label='Length' dataKey="distance"/>
        <Column width={80} label='Duration' dataKey="duration" cellDataGetter={({rowData}) => _.get(durationsMap, [rowData.duration, 'slug'])}/>
        {admin && <Column width={90} dataKey="controls" label="Controls" cellRenderer={this.renderControls}/>}
      </Table>
    );
  }

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
    const editHandler = () => this.props.onEditSection(rowData._id);
    const deleteHandler = () => this.props.onDeleteSection(rowData._id);
    return (
      <AdminControls onEdit={editHandler} onDelete={deleteHandler}/>
    );
  };

  onRowClick = ({index}) => this.props.onSectionClick(this.props.sections[index]._id);
}

const styles = {
  rating: {
    minWidth: 10,
  },
};