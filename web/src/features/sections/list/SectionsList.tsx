import Rating from 'react-rating';
import * as React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { ResourcesList } from '../../../layout';
import { renderDifficulty } from '../../../ww-clients/utils';
import { Section } from '../../../ww-commons';
import { SectionsListProps } from './types';

interface State {
  // Pure virtualized table escape hatch
  // https://github.com/bvaughn/react-virtualized#pure-components
  refresher: number;
}

export default class SectionsList extends React.PureComponent<SectionsListProps, State> {
  state: State = { refresher: 0 };

  onSectionClick = (id: string) => {
    // console.log(id);
  };

  customSettingsLink = (row: Section) => `/regions/${row.region.id}/sections/${row.id}/settings`;

  renderName: TableCellRenderer = ({ rowData: { river: { name: riverName }, name } }) =>
    `${riverName} - ${name}`;

  renderDifficulty: TableCellRenderer = ({ rowData }) => renderDifficulty(rowData);

  renderRating: TableCellRenderer = ({ rowData: { rating } }) => (
    <Rating
      readonly
      start={0}
      stop={5}
      initialRating={rating}
      emptySymbol={<i className="material-icons">star_border</i>}
      fullSymbol={<i className="material-icons">star</i>}
    />
  );

  render() {
    return (
      <ResourcesList
        list={this.props.sections.nodes}
        onResourceClick={this.onSectionClick}
        resourceType="section"
        customSettingsLink={this.customSettingsLink}
        deleteHandle={this.props.removeSection}
        refresher={this.state.refresher}
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
