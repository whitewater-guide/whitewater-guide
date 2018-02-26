import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ResourcesList } from '../../../layout';
import { River } from '../../../ww-commons';
import { RiversListProps } from './types';

interface State {
  // Pure virtualized table escape hatch
  // https://github.com/bvaughn/react-virtualized#pure-components
  refresher: number;
}

export default class RiversList extends React.PureComponent<RiversListProps, State> {
  state: State = { refresher: 0 };

  onRiverClick = (id: string) => {
    // console.log(id);
  };

  customSettingsLink = (row: River) => `/regions/${row.region.id}/rivers/${row.id}/settings`;

  renderAltNames: TableCellRenderer = ({ rowData: { altNames } }) =>
    altNames ? altNames.join(', ') : '';

  renderNumSections: TableCellRenderer = ({ rowData: { sections: { count } } }) =>
    count;

  renderAddSection = (row: River) => {
    return (
      <FlatButton
        href={`/regions/${row.region.id}/sections/new?riverId=${row.id}`}
        label="Add Section"
        icon={<FontIcon className="material-icons">add</FontIcon>}
        style={{ verticalAlign: 'sub' }}
      />
    );
  };

  render() {
    return (
      <ResourcesList
        list={this.props.rivers.nodes}
        onResourceClick={this.onRiverClick}
        resourceType="river"
        customSettingsLink={this.customSettingsLink}
        deleteHandle={this.props.removeRiver}
        refresher={this.state.refresher}
        renderExtraAdminActions={this.renderAddSection}
      >
        <Column width={200} flexGrow={1} label="Name" dataKey="name" />
        <Column width={70} label="Alt.Names" dataKey="altNames" cellRenderer={this.renderAltNames}/>
        <Column width={70} label="# Sections" dataKey="sections" cellRenderer={this.renderNumSections}/>
      </ResourcesList>
    );
  }
}
