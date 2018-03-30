import FontIcon from 'material-ui/FontIcon';
import moment from 'moment';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { Rating } from '../../../components';
import { ResourcesList } from '../../../layout';
import { getSectionColor } from '../../../ww-clients/features/sections';
import { renderDifficulty } from '../../../ww-clients/utils';
import { Durations, Section } from '../../../ww-commons';
import { SectionsListProps } from './types';

export default class SectionsList extends React.PureComponent<SectionsListProps> {

  onSectionClick = (id: string) => {
    const { history, regionId } = this.props;
    history.push(`/regions/${regionId}/sections/${id}#main`);
  };

  customSettingsLink = (row: Section) => `/regions/${this.props.regionId}/sections/${row.id}/settings`;

  renderName: TableCellRenderer = ({ rowData: { river: { name: riverName }, name } }) =>
    `${riverName} - ${name}`;

  renderDifficulty: TableCellRenderer = ({ rowData }) => renderDifficulty(rowData);

  renderDuration: TableCellRenderer = ({ rowData: { duration } }) => duration && Durations.get(duration);

  renderRating: TableCellRenderer = ({ rowData: { rating } }) => (
    <Rating value={rating} />
  );

  renderValue: TableCellRenderer = ({ rowData }) => {
    const { gauge }: Section = rowData;
    if (!gauge) {
      return null;
    }
    const { lastMeasurement, flowUnit, levelUnit } = gauge;
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

  renderStatus: TableCellRenderer = ({ rowData }) => {
    const { gauge }: Section = rowData;
    if (!gauge) {
      return null;
    }
    const { lastMeasurement } = gauge;
    if (lastMeasurement) {
      const color = getSectionColor(rowData);
      return (
        <FontIcon className="material-icons" color={color}>fiber_manual_record</FontIcon>
      );
    }
    return null;
  };

  render() {
    return (
      <ResourcesList
        list={this.props.sections.nodes}
        onResourceClick={this.onSectionClick}
        resourceType="section"
        customSettingsLink={this.customSettingsLink}
        deleteHandle={this.props.removeSection}
      >
        <Column width={200} flexGrow={1} label="Name" dataKey="name" cellRenderer={this.renderName} />
        <Column width={120} label="Difficulty" dataKey="difficulty" cellRenderer={this.renderDifficulty} />
        <Column width={180} label="Last value" dataKey="lastMeasurement" cellRenderer={this.renderValue} />
        <Column width={30} label="" dataKey="status" cellRenderer={this.renderStatus} />
        <Column width={150} label="Rating" dataKey="rating" cellRenderer={this.renderRating} />
        <Column width={50} label="Length" dataKey="distance" />
        <Column width={80} label="Duration" dataKey="duration" cellRenderer={this.renderDuration}/>
      </ResourcesList>
    );
  }
}
