import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { AdminColumn, renderBoolean } from '../../../components/tables';
import { ResourcesListCard } from '../../../layout';
import { RegionsListProps } from './types';

export class RegionsList extends React.PureComponent<RegionsListProps> {

  renderVisible: TableCellRenderer = renderBoolean(undefined, 'visibility');

  renderCount: TableCellRenderer = ({ cellData: { count } }) => count;

  onRegionClick = (id: string) => this.props.history.push(`/regions/${id}`);

  render() {
    return (
      <ResourcesListCard
        list={this.props.regions.nodes}
        onResourceClick={this.onRegionClick}
        resourceType="region"
        deleteHandle={this.props.removeRegion}
      >
        <Column width={200} flexGrow={1} label="Name" dataKey="name" />
        <Column width={100} label="Gauges" dataKey="gauges" cellRenderer={this.renderCount} />
        <Column width={100} label="Rivers" dataKey="rivers" cellRenderer={this.renderCount} />
        <Column width={100} label="Sections" dataKey="sections" cellRenderer={this.renderCount} />
        <AdminColumn width={50} label="Visible" dataKey="hidden" cellRenderer={this.renderVisible} />
      </ResourcesListCard>
    );
  }
}
