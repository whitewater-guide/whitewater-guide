import { Gauge, HarvestMode } from '@whitewater-guide/commons';
import moment from 'moment';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import {
  AdminColumn,
  ClickBlocker,
  DeleteButton,
  HarvestStatusIndicator,
  IconLink,
  MutationToggle,
} from '../../../components';
import { ResourcesList } from '../../../layout';
import { emitter, paths, POKE_TABLES } from '../../../utils';
import { GaugesListInnerProps } from './types';

export default class GaugesList extends React.PureComponent<
  GaugesListInnerProps
> {
  onGaugeClick = (id: string) => {
    const {
      history,
      match: {
        params: { sourceId },
      },
    } = this.props;
    history.push(`/sources/${sourceId}/gauges/${id}`);
  };

  toggleGauge = async (id: string, enabled: boolean) => {
    await this.props.toggleGauge(id, enabled);
    emitter.emit(POKE_TABLES);
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
    const {
      match: {
        params: { sourceId },
      },
    } = this.props;
    return (
      <ClickBlocker>
        <IconLink to={paths.settings({ sourceId, gaugeId })} icon="edit" />
        <DeleteButton id={gaugeId} deleteHandler={this.props.removeGauge} />
      </ClickBlocker>
    );
  };

  render() {
    return (
      <ResourcesList
        list={this.props.gauges.nodes}
        onResourceClick={this.onGaugeClick}
      >
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
          cellRenderer={this.renderStatus}
        />
        <AdminColumn width={70} label="Cron" dataKey="cron" />
        <AdminColumn
          width={100}
          label="Request params"
          dataKey="rp"
          cellRenderer={this.renderRequestParams}
        />
        <AdminColumn
          width={70}
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
      </ResourcesList>
    );
  }
}
