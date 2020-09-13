import { Source } from '@whitewater-guide/commons';
import { History } from 'history';
import React from 'react';
import { Column } from 'react-virtualized';

import {
  ClickBlocker,
  DeleteButton,
  HarvestStatusIndicator,
  IconLink,
  isEmptyRow,
  MutationToggle,
  TableCellRenderer,
  UnstyledLink,
} from '../../../components';
import { AdminColumn, Table } from '../../../components/tables';
import { paths } from '../../../utils';

const renderName: TableCellRenderer<Source> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return (
    <UnstyledLink sourceId={rowData.id} suffix="/gauges">
      {rowData.name}
    </UnstyledLink>
  );
};

interface Props {
  sources: Source[];
  history: History;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

export default class SourcesTable extends React.PureComponent<Props> {
  onSourceClick = (id: string) =>
    this.props.history.push(paths.to({ sourceId: id, suffix: '/gauges' }));

  toggleSource = async (id: string, enabled: boolean) => {
    await this.props.onToggle(id, enabled);
  };

  renderEnabled: TableCellRenderer<Source> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { id, enabled } = rowData;
    return (
      <MutationToggle id={id} enabled={!!enabled} toggle={this.toggleSource} />
    );
  };

  renderStatus: TableCellRenderer<Source> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { status } = rowData;
    return <HarvestStatusIndicator status={status} />;
  };

  renderCron: TableCellRenderer<Source> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { cron } = rowData;
    return cron;
  };

  renderActions: TableCellRenderer<Source> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { id: sourceId } = rowData;
    return (
      <ClickBlocker>
        <IconLink to={paths.settings({ sourceId })} icon="edit" />
        <DeleteButton id={sourceId} deleteHandler={this.props.onRemove} />
      </ClickBlocker>
    );
  };

  render() {
    return (
      <Table data={this.props.sources} onNodeClick={this.onSourceClick}>
        <Column
          width={200}
          flexGrow={1}
          label="Name"
          dataKey="name"
          cellRenderer={renderName}
        />
        <AdminColumn
          width={70}
          label="Status"
          dataKey="status"
          className="centered"
          headerClassName="centered"
          cellRenderer={this.renderStatus}
        />
        <AdminColumn
          width={70}
          label="Cron"
          dataKey="cron"
          cellRenderer={this.renderCron}
        />
        <AdminColumn
          width={70}
          label="Enabled"
          dataKey="enabled"
          headerClassName="centered"
          cellRenderer={this.renderEnabled}
        />
        <AdminColumn
          width={120}
          label="Actions"
          dataKey="action"
          headerClassName="actions"
          cellRenderer={this.renderActions}
        />
      </Table>
    );
  }
}
