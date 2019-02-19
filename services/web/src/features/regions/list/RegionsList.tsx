import { AdminOnly } from '@whitewater-guide/clients';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { AdminColumn, renderBoolean } from '../../../components/tables';
import { EditorFooterProps, ResourcesListCard } from '../../../layout';
import { paths } from '../../../utils';
import { RegionsListProps } from './types';

const FooterProps: EditorFooterProps = { adminOnly: true };

export class RegionsList extends React.PureComponent<RegionsListProps> {
  renderVisible: TableCellRenderer = renderBoolean(undefined, 'visibility');
  renderPremium: TableCellRenderer = renderBoolean('grade');

  renderCount: TableCellRenderer = ({ cellData: { count } }) => count;

  renderActions: TableCellRenderer = ({
    rowData: { id: regionId, editable },
  }) => {
    return (
      <ClickBlocker>
        {editable && <IconLink to={paths.settings({ regionId })} icon="edit" />}
        <AdminOnly>
          <DeleteButton id={regionId} deleteHandler={this.props.removeRegion} />
          <IconLink to={paths.admin({ regionId })} icon="settings" />
        </AdminOnly>
      </ClickBlocker>
    );
  };

  onRegionClick = (id: string) => this.props.history.push(`/regions/${id}`);

  render() {
    return (
      <ResourcesListCard
        list={this.props.regions.nodes}
        onResourceClick={this.onRegionClick}
        resourceType="region"
        footerProps={FooterProps}
      >
        <Column width={200} flexGrow={1} label="Name" dataKey="name" />
        <Column
          width={100}
          label="Gauges"
          dataKey="gauges"
          cellRenderer={this.renderCount}
        />
        <Column
          width={100}
          label="Rivers"
          dataKey="rivers"
          cellRenderer={this.renderCount}
        />
        <Column
          width={100}
          label="Sections"
          dataKey="sections"
          cellRenderer={this.renderCount}
        />
        <AdminColumn
          width={50}
          label="Premium"
          dataKey="premium"
          cellRenderer={this.renderPremium}
        />
        <AdminColumn
          width={50}
          label="Visible"
          dataKey="hidden"
          cellRenderer={this.renderVisible}
        />
        <Column
          width={150}
          label="Actions"
          dataKey="hidden"
          cellRenderer={this.renderActions}
        />
      </ResourcesListCard>
    );
  }
}
