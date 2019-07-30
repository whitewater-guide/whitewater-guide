import { Gauge, HarvestMode, Source } from '@whitewater-guide/commons';
import { History } from 'history';
import moment from 'moment';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import {
  ClickBlocker,
  DeleteButton,
  HarvestStatusIndicator,
  IconLink,
  MutationToggle,
} from '../../../components';
import { AdminColumn, Table } from '../../../components/tables';
import { paths } from '../../../utils';

interface Props {
  source: Source;
  gauges: Gauge[];
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

  renderEnabled: TableCellRenderer = ({ rowData: { id, enabled } }) => (
    <MutationToggle id={id} enabled={enabled} toggle={this.toggleGauge} />
  );

  renderStatus: TableCellRenderer = ({ rowData: { status } }) => {
    const showStatus = this.props.source.harvestMode === HarvestMode.ONE_BY_ONE;
    return showStatus ? <HarvestStatusIndicator status={status} /> : null;
  };

  renderRequestParams: TableCellRenderer = ({ rowData: { requestParams } }) => {
    return requestParams ? JSON.stringify(requestParams) : null;
  };

  renderValue: TableCellRenderer = ({ rowData }) => {
    const { lastMeasurement, flowUnit, levelUnit }: Gauge = rowData;
    if (lastMeasurement) {
      const { timestamp, flow, level } = lastMeasurement;
      const v = flow ? flow : level;
      const unit = flow ? flowUnit : levelUnit;
      return (
        <span>
          <b>{v.toPrecision(3)}</b>
          {` ${unit} ${moment(timestamp).fromNow()}`}
        </span>
      );
    }
    return null;
  };

  renderActions: TableCellRenderer = ({ rowData: { id: gaugeId } }) => {
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
    return (
      <Table data={this.props.gauges} onNodeClick={this.onGaugeClick}>
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
