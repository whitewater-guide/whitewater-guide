import { NamedNode } from '@whitewater-guide/commons';
import { History } from 'history';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ClickBlocker, DeleteButton, IconLink } from '../../../components';
import { AdminColumn, BooleanColumn, Table } from '../../../components/tables';
import { Styles } from '../../../styles';
import { paths } from '../../../utils';
import BannerPreview from './BannerPreview';
import { ListedBanner } from './listBanners.query';

const styles: Styles = {
  multiline: {
    whiteSpace: 'pre-line',
  },
};

interface Props {
  banners: ListedBanner[];
  onRemove: (id: string) => void;
  history: History;
}

export default class BannersTable extends React.PureComponent<Props> {
  onBannerClick = (id: string) =>
    this.props.history.push(`/banners/${id}/settings`);

  renderActions: TableCellRenderer = ({ rowData: { id: bannerId } }) => {
    return (
      <ClickBlocker>
        <IconLink to={paths.settings({ bannerId })} icon="edit" />
        <DeleteButton id={bannerId} deleteHandler={this.props.onRemove} />
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
      <Table
        data={this.props.banners}
        onNodeClick={this.onBannerClick}
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
        <BooleanColumn
          width={45}
          label="Enabled"
          dataKey="enabled"
          adminOnly={true}
          iconTrue="check"
        />
        <AdminColumn
          width={100}
          label="Actions"
          dataKey="action"
          headerClassName="actions"
          className="centered"
          cellRenderer={this.renderActions}
        />
      </Table>
    );
  }
}
