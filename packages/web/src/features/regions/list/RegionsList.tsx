import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import { Link } from 'react-router-dom';
import { Column, TableCellRenderer } from 'react-virtualized';
import { AdminColumn, renderBoolean } from '../../../components/tables';
import { ResourcesListCard } from '../../../layout';
import { Region } from '../../../ww-commons';
import { RegionsListProps } from './types';

export class RegionsList extends React.PureComponent<RegionsListProps> {

  renderVisible: TableCellRenderer = renderBoolean(undefined, 'visibility');
  renderPremium: TableCellRenderer = renderBoolean('grade');

  renderCount: TableCellRenderer = ({ cellData: { count } }) => count;

  renderExtraAdmin = ({ id }: Region) => (
    <Link to={`/regions/${id}/admin`}>
      <FontIcon className="material-icons">settings</FontIcon>
    </Link>
  );

  onRegionClick = (id: string) => this.props.history.push(`/regions/${id}`);

  render() {
    return (
      <ResourcesListCard
        list={this.props.regions.nodes}
        onResourceClick={this.onRegionClick}
        resourceType="region"
        deleteHandle={this.props.removeRegion}
        renderExtraAdminActions={this.renderExtraAdmin}
        adminColumnWidth={120}
      >
        <Column width={200} flexGrow={1} label="Name" dataKey="name" />
        <Column width={100} label="Gauges" dataKey="gauges" cellRenderer={this.renderCount} />
        <Column width={100} label="Rivers" dataKey="rivers" cellRenderer={this.renderCount} />
        <Column width={100} label="Sections" dataKey="sections" cellRenderer={this.renderCount} />
        <Column width={50} label="Premium" dataKey="premium" cellRenderer={this.renderPremium} />
        <AdminColumn width={50} label="Visible" dataKey="hidden" cellRenderer={this.renderVisible} />
      </ResourcesListCard>
    );
  }
}
