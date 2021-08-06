import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import Rating from '@material-ui/lab/Rating';
import {
  formatDistanceToNow,
  getBindingFormula,
  getSectionColor,
  ListedSectionFragment,
  renderDifficulty,
  sectionName,
} from '@whitewater-guide/clients';
import parseISO from 'date-fns/parseISO';
import { History } from 'history';
import isNil from 'lodash/isNil';
import React from 'react';
import { Column, IndexRange, TableProps } from 'react-virtualized';

import {
  AdminColumn,
  ClickBlocker,
  EditorColumn,
  IconLink,
  isEmptyRow,
  TableCellRenderer,
  UnstyledLink,
} from '../../../components';
import { Table } from '../../../components/tables';
import { paths } from '../../../utils';
import NameFilter from './NameFilter';
import SectionMenu from './SectionMenu';
import { OuterProps } from './types';

interface Props extends OuterProps {
  onRemove: (id: string) => void;
  history: History;
  onRowsRendered?: TableProps['onRowsRendered'];
}

export default class SectionsTable extends React.PureComponent<Props> {
  private readonly _scrollToIndex: number | undefined;

  constructor(props: Props) {
    super(props);
    this._scrollToIndex =
      this.props.history.location.state &&
      (this.props.history.location.state as any).scrollIndex;
  }

  onSectionClick = (id: string) => {
    const { history, regionId } = this.props;
    history.push(`/regions/${regionId}/sections/${id}#main`);
  };

  renderName: TableCellRenderer<ListedSectionFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return (
      <UnstyledLink regionId={this.props.regionId} sectionId={rowData.id}>
        {sectionName(rowData)}
      </UnstyledLink>
    );
  };

  renderNameHeader = () => <NameFilter />;

  renderDifficulty: TableCellRenderer<ListedSectionFragment> = ({
    rowData,
  }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return renderDifficulty(rowData);
  };

  renderHidden: TableCellRenderer<ListedSectionFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return rowData.hidden ? <Icon>visibility_off</Icon> : null;
  };

  renderDemo: TableCellRenderer<ListedSectionFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return rowData.demo ? <Icon>lock_open</Icon> : null;
  };

  renderRating: TableCellRenderer<ListedSectionFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return (
      <Rating value={rowData.rating} size="small" precision={0.5} readOnly />
    );
  };

  renderValue: TableCellRenderer<ListedSectionFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { gauge, flows, levels } = rowData;
    if (!gauge) {
      return null;
    }
    const { latestMeasurement, flowUnit, levelUnit } = gauge;
    if (latestMeasurement) {
      const { timestamp, flow, level } = latestMeasurement;
      const v = flow || level;
      const unit = flow ? flowUnit : levelUnit;
      const formula = getBindingFormula(flow ? flows : levels);
      const fromNow = formatDistanceToNow(parseISO(timestamp), {
        addSuffix: true,
      });
      if (isNil(v)) {
        return null;
      }
      return (
        <span>
          <b>{formula(v)?.toPrecision(3)}</b>
          {` ${unit} ${fromNow}`}
        </span>
      );
    }
    return null;
  };

  renderStatus: TableCellRenderer<ListedSectionFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { gauge } = rowData;
    if (!gauge) {
      return null;
    }
    const { latestMeasurement } = gauge;
    if (latestMeasurement) {
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

  renderActions: TableCellRenderer<ListedSectionFragment> = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    const { regionId } = this.props;
    return (
      <ClickBlocker>
        <IconLink
          to={paths.settings({ regionId, sectionId: rowData.id })}
          icon="edit"
        />
        <SectionMenu
          section={rowData}
          regionId={regionId}
          deleteHandler={this.props.onRemove}
        />
      </ClickBlocker>
    );
  };

  onRowsRendered = (info: IndexRange) => {
    const { history } = this.props;
    history.replace(history.location.pathname, {
      scrollIndex: info.stopIndex,
    });
  };

  render() {
    const { sections } = this.props;
    return (
      <Table
        data={sections}
        onNodeClick={this.onSectionClick}
        onRowsRendered={this.onRowsRendered}
        scrollToIndex={this._scrollToIndex}
      >
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
        <AdminColumn
          width={50}
          label="Demo"
          dataKey="demo"
          headerClassName="centered"
          cellRenderer={this.renderDemo}
        />
        <EditorColumn
          width={80}
          label="Hidden"
          dataKey="hidden"
          headerClassName="centered"
          cellRenderer={this.renderHidden}
        />
        <EditorColumn
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
