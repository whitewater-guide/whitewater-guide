import { NamedNode } from '@whitewater-guide/commons';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { AdminColumn, renderBoolean } from '../../../components/tables';
import { ResourcesListCard } from '../../../layout';
import { Styles } from '../../../styles';
import { paths } from '../../../utils';
import BannerPreview from './BannerPreview';
import { BannerListProps } from './types';

const styles: Styles = {
  multiline: {
    whiteSpace: 'pre-line',
  },
};

export default class BannersList extends React.PureComponent<BannerListProps> {
  onBannerClick = (id: string) =>
    this.props.history.push(`/banners/${id}/settings`);

  renderEnabled: TableCellRenderer = renderBoolean('check');

  renderActions: TableCellRenderer = ({ rowData: { id: bannerId } }) => {
    return (
      <ClickBlocker>
        <IconLink to={paths.settings({ bannerId })} icon="edit" />
        <DeleteButton id={bannerId} deleteHandler={this.props.removeBanner} />
      </ClickBlocker>
    );
  };

  renderBanner: TableCellRenderer = ({ rowData: { source } }) => (
    <BannerPreview source={source} />
  );

  renderPlacement: TableCellRenderer = ({ rowData: { placement } }) => (
    <p>{upperFirst(snakeCase(placement)).replace(/_/g, ' ')}</p>
  );

  renderGroups: TableCellRenderer = ({ rowData: { groups } }) => (
    <ul>
      {groups.nodes.map(({ id, name }: NamedNode) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  );

  renderRegions: TableCellRenderer = ({ rowData: { regions } }) => (
    <ul>
      {regions.nodes.map(({ id, name }: NamedNode) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  );

  render() {
    return (
      <ResourcesListCard
        resourceType="banner"
        list={this.props.banners.nodes}
        onResourceClick={this.onBannerClick}
        rowHeight={188}
      >
        <Column
          width={150}
          flexGrow={1}
          label="Name"
          dataKey="name"
          style={styles.multiline}
        />
        <Column
          width={100}
          label="Slug"
          dataKey="slug"
          style={styles.multiline}
        />
        <Column
          width={100}
          label="Placement"
          dataKey="placement"
          cellRenderer={this.renderPlacement}
          style={styles.multiline}
        />
        <Column
          width={528}
          label="Preview"
          dataKey="source"
          cellRenderer={this.renderBanner}
        />
        <Column
          width={100}
          flexGrow={1}
          label="Groups"
          dataKey="groups"
          cellRenderer={this.renderGroups}
        />
        <Column
          width={100}
          flexGrow={1}
          label="Regions"
          dataKey="regions"
          cellRenderer={this.renderRegions}
        />
        <Column width={40} label="Priority" dataKey="priority" />
        <AdminColumn
          width={45}
          label="Enabled"
          dataKey="enabled"
          cellRenderer={this.renderEnabled}
        />
        <AdminColumn
          width={100}
          label="Actions"
          dataKey="action"
          cellRenderer={this.renderActions}
        />
      </ResourcesListCard>
    );
  }
}
