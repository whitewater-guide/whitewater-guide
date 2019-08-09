import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import {
  AdminOnly,
  formatDistanceToNow,
  getBindingFormula,
  getSectionColor,
  renderDifficulty,
} from '@whitewater-guide/clients';
import { Durations, Section, sectionName } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import { History } from 'history';
import React from 'react';
import { Column } from 'react-virtualized';
import {
  ClickBlocker,
  DeleteButton,
  IconLink,
  isEmptyRow,
  TableCellRenderer,
} from '../../../components';
import { Table } from '../../../components/tables';
import { paths } from '../../../utils';
import NameFilter from './NameFilter';
import { OuterProps } from './types';

interface Props extends OuterProps {
  onRemove: (id: string) => void;
  history: History;
}

export default class SectionsTable extends React.PureComponent<Props> {
  onSectionClick = (id: string) => {
    const { history, regionId } = this.props;
    history.push(`/regions/${regionId}/sections/${id}#main`);
  };

  renderName: TableCellRenderer<Section> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return sectionName(rowData);
  };

  renderNameHeader = () => <NameFilter />;

  renderDifficulty: TableCellRenderer<Section> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return renderDifficulty(rowData);
  };

  renderDuration: TableCellRenderer<Section> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return rowData.duration && Durations.get(rowData.duration);
  };

  renderRating: TableCellRenderer<Section> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return (
      <Rating
        value={rowData.rating}
        size="small"
        precision={0.5}
        readOnly={true}
      />
    );
  };

  renderValue: TableCellRenderer<Section> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { gauge, flows, levels }: Section = rowData;
    if (!gauge) {
      return null;
    }
    const { lastMeasurement, flowUnit, levelUnit } = gauge;
    if (lastMeasurement) {
      const { timestamp, flow, level } = lastMeasurement;
      const v = flow ? flow : level;
      const unit = flow ? flowUnit : levelUnit;
      const formula = getBindingFormula(flow ? flows : levels);
      const fromNow = formatDistanceToNow(parseISO(timestamp), {
        addSuffix: true,
      });
      return (
        <span>
          <b>{formula(v).toPrecision(3)}</b>
          {` ${unit} ${fromNow}`}
        </span>
      );
    }
    return null;
  };

  renderStatus: TableCellRenderer<Section> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { gauge } = rowData;
    if (!gauge) {
      return null;
    }
    const { lastMeasurement } = gauge;
    if (lastMeasurement) {
      const color = getSectionColor(rowData);
      return (
        <Box
          width={16}
          minWidth={16}
          height={16}
          minHeight={16}
          borderRadius={8}
          style={{ backgroundColor: color }}
        />
      );
    }
    return null;
  };

  renderActions: TableCellRenderer<Section> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const sectionId = rowData.id;
    const { regionId } = this.props;
    return (
      <ClickBlocker>
        <IconLink to={paths.settings({ regionId, sectionId })} icon="edit" />
        <DeleteButton id={sectionId} deleteHandler={this.props.onRemove} />
        <AdminOnly>
          <IconLink to={paths.admin({ regionId, sectionId })} icon="settings" />
        </AdminOnly>
      </ClickBlocker>
    );
  };

  render() {
    return (
      <Table data={this.props.sections} onNodeClick={this.onSectionClick}>
        <Column
          width={200}
          flexGrow={1}
          label="Name"
          dataKey="name"
          cellRenderer={this.renderName}
          headerRenderer={this.renderNameHeader}
        />
        <Column
          width={120}
          label="Difficulty"
          dataKey="difficulty"
          cellRenderer={this.renderDifficulty}
        />
        <Column
          width={180}
          label="Last value"
          dataKey="lastMeasurement"
          cellRenderer={this.renderValue}
        />
        <Column
          width={40}
          label=""
          dataKey="status"
          cellRenderer={this.renderStatus}
        />
        <Column
          width={150}
          label="Rating"
          dataKey="rating"
          cellRenderer={this.renderRating}
        />
        <Column
          width={70}
          label="Length"
          dataKey="distance"
          headerClassName="centered"
        />
        <Column
          width={80}
          label="Duration"
          dataKey="duration"
          headerClassName="centered"
          cellRenderer={this.renderDuration}
        />
        <Column
          width={120}
          label="Actions"
          dataKey="actions"
          headerClassName="actions"
          cellRenderer={this.renderActions}
        />
      </Table>
    );
  }
}
