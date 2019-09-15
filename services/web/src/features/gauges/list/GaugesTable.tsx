import { formatDistanceToNow } from '@whitewater-guide/clients';
import {
  Connection,
  Gauge,
  HarvestMode,
  Source,
} from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
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
} from '../../../components';
import { AdminColumn, Table } from '../../../components/tables';
import { paths } from '../../../utils';

interface Props {
  source: Source;
  gauges?: Connection<Gauge>;
  history: History;
  onToggle: (id: string, enabled: boolean) => void;
  onRemove: (id: string) => void;
}

export default class GaugesTable extends React.PureComponent<Props> {
  onGaugeClick = (id: string) => {
    const { history, source } = this.props;
    history.push(`/sources/${source.id}/gauges/${id}`);
  };

  toggleGauge = async (id: string, enabled: boolean) => {
    await this.props.onToggle(id, enabled);
  };

  renderEnabled: TableCellRenderer<Gauge> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { id, enabled } = rowData;
    return (
      <MutationToggle id={id} enabled={enabled} toggle={this.toggleGauge} />
    );
  };

  renderStatus: TableCellRenderer<Gauge> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const showStatus = this.props.source.harvestMode === HarvestMode.ONE_BY_ONE;
    return showStatus ? (
      <HarvestStatusIndicator status={rowData.status} />
    ) : null;
  };

  renderRequestParams: TableCellRenderer<Gauge> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { requestParams } = rowData;
    return requestParams ? JSON.stringify(requestParams) : null;
  };

  renderValue: TableCellRenderer<Gauge> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { lastMeasurement, flowUnit, levelUnit }: Gauge = rowData;
    if (lastMeasurement) {
      const { timestamp, flow, level } = lastMeasurement;
      const v = flow ? flow : level;
      const unit = flow ? flowUnit : levelUnit;
      const fromNow = formatDistanceToNow(parseISO(timestamp), {
        addSuffix: true,
      });
      return (
        <span>
          <b>{v.toPrecision(3)}</b>
          {` ${unit} ${fromNow}`}
        </span>
      );
    }
    return null;
  };

  renderActions: TableCellRenderer<Gauge> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const gaugeId = rowData.id;
    const { source } = this.props;
    const edit = paths.settings({ sourceId: source.id, gaugeId });
    return (
      <ClickBlocker>
        <IconLink to={edit} icon="edit" />
        <DeleteButton id={gaugeId} deleteHandler={this.props.onRemove} />
      </ClickBlocker>
    );
  };

  render() {
    const { gauges } = this.props;
    const { nodes = [], count = 0 } = gauges || {};
    return (
      <Table data={nodes} count={count} onNodeClick={this.onGaugeClick}>
        <Column width={200} flexGrow={4} label="Name" dataKey="name" />
        <Column width={70} flexGrow={1} label="Code" dataKey="code" />
        <Column
          width={200}
          flexGrow={1}
          label="Last value"
          dataKey="lastMeasurement"
          cellRenderer={this.renderValue}
        />
        <Column
          width={50}
          label="Status"
          dataKey="status"
          className="centered"
          headerClassName="centered"
          cellRenderer={this.renderStatus}
        />
        <AdminColumn width={70} label="Cron" dataKey="cron" />
        <AdminColumn
          width={120}
          label="Request params"
          dataKey="rp"
          className="centered"
          headerClassName="centered"
          cellRenderer={this.renderRequestParams}
        />
        <AdminColumn
          width={70}
          label="Enabled"
          dataKey="enabled"
          className="centered"
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