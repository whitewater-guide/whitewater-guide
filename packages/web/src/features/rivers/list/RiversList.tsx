import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ResourcesList } from '../../../layout';
import { River } from '../../../ww-commons';
import { RiversListProps } from './types';

export default class RiversList extends React.PureComponent<RiversListProps> {

  onRiverClick = (id: string) => {
    // console.log(id);
  };

  customSettingsLink = (row: River) => `/regions/${row.region.id}/rivers/${row.id}/settings`;

  renderAltNames: TableCellRenderer = ({ rowData: { altNames } }) =>
    altNames ? altNames.join(', ') : '';

  renderNumSections: TableCellRenderer = ({ rowData: { sections: { count } } }) =>
    count;

  renderAddSection = (row: River) => {
    const href = this.props.history.createHref({
      pathname: `/regions/${row.region.id}/sections/new`,
      search: `?riverId=${row.id}`,
    });
    return (
      <FlatButton
        href={href}
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
        renderExtraAdminActions={this.renderAddSection}
        adminColumnWidth={250}
      >
        <Column width={200} flexGrow={1} label="Name" dataKey="name" />
        <Column width={70} label="Alt.Names" dataKey="altNames" cellRenderer={this.renderAltNames}/>
        <Column width={70} label="# Sections" dataKey="sections" cellRenderer={this.renderNumSections}/>
      </ResourcesList>
    );
  }
}
