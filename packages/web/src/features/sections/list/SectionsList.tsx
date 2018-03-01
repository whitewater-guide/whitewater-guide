import * as React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { Rating } from '../../../components';
import { ResourcesList } from '../../../layout';
import { renderDifficulty } from '../../../ww-clients/utils';
import { Section } from '../../../ww-commons';
import { SectionsListProps } from './types';

export default class SectionsList extends React.PureComponent<SectionsListProps> {

  onSectionClick = (id: string) => {
    // console.log(id);
  };

  customSettingsLink = (row: Section) => `/regions/${this.props.regionId}/sections/${row.id}/settings`;

  renderName: TableCellRenderer = ({ rowData: { river: { name: riverName }, name } }) =>
    `${riverName} - ${name}`;

  renderDifficulty: TableCellRenderer = ({ rowData }) => renderDifficulty(rowData);

  renderRating: TableCellRenderer = ({ rowData: { rating } }) => (
    <Rating value={rating} />
  );

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
        <Column width={150} label="Rating" dataKey="rating" cellRenderer={this.renderRating} />
        <Column width={50} label="Length" dataKey="distance" />
        <Column width={60} label="Duration" dataKey="duration" />
      </ResourcesList>
    );
  }
}
