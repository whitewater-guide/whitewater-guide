import { formatDistanceToNow } from '@whitewater-guide/clients';
import type { Node } from '@whitewater-guide/schema';
import parseISO from 'date-fns/parseISO';
import type { History } from 'history';
import isNil from 'lodash/isNil';
import React from 'react';

import type { TableCellRenderer } from '../../../components';
import {
  ClickBlocker,
  Column,
  DeleteButton,
  HarvestStatusIndicator,
  IconLink,
  isEmptyRow,
  UnstyledLink,
} from '../../../components';
import { AdminColumn, BooleanColumn, Table } from '../../../components/tables';
import { paths } from '../../../utils';
import type {
  ListGaugesQuery,
  ListGaugesRowFragment,
} from './listGauges.generated';

interface Props {
  source: Node;
  gauges?: ListGaugesQuery['gauges'];
  history: History;
  onRemove: (id: string) => void;
}

export default class GaugesTable extends React.PureComponent<Props> {
  onGaugeClick = (id: string) => {
    const { history, source } = this.props;
    history.push(paths.to({ sourceId: source.id, gaugeId: id }));
  };

  renderName: TableCellRenderer<ListGaugesRowFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return (
      <UnstyledLink sourceId={this.props.source.id} gaugeId={rowData.id}>
        {rowData.name}
      </UnstyledLink>
    );
  };

  renderStatus: TableCellRenderer<ListGaugesRowFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return <HarvestStatusIndicator status={rowData.status} />;
  };

  renderRequestParams: TableCellRenderer<ListGaugesRowFragment> = ({
    rowData,
  }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { requestParams } = rowData;
    return requestParams ? JSON.stringify(requestParams) : null;
  };

  renderValue: TableCellRenderer<ListGaugesRowFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { latestMeasurement, flowUnit, levelUnit } = rowData;
    if (latestMeasurement) {
      const { timestamp, flow, level } = latestMeasurement;
      const v = flow || level;
      const unit = flow ? flowUnit : levelUnit;
      const fromNow = formatDistanceToNow(parseISO(timestamp), {
        addSuffix: true,
      });
      if (isNil(v) || !unit) {
        return null;
      }
      return (
        <span>
          <b>{v.toPrecision(3)}</b>
          {` ${unit} ${fromNow}`}
        </span>
      );
    }
    return null;
  };

  renderActions: TableCellRenderer<ListGaugesRowFragment> = ({ rowData }) => {
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
        <Column
          width={200}
          flexGrow={4}
          label="Name"
          dataKey="name"
          cellRenderer={this.renderName}
        />
        <Column width={70} flexGrow={1} label="Code" dataKey="code" />
        <Column
          width={200}
          flexGrow={1}
          label="Last value"
          dataKey="lastMeasurement"
          cellRenderer={this.renderValue}
        />
        <Column
          width={60}
          label="Status"
          dataKey="status"
          className="centered"
          headerClassName="centered"
          cellRenderer={this.renderStatus}
        />
        <AdminColumn
          width={120}
          label="Request params"
          dataKey="rp"
          className="centered"
          headerClassName="centered"
          cellRenderer={this.renderRequestParams}
        />
        <BooleanColumn
          width={70}
          label="Enabled"
          dataKey="enabled"
          iconTrue="check"
          className="centered"
          headerClassName="centered"
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
