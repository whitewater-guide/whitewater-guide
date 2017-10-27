import * as React from 'react';
import { Column } from 'react-virtualized';
import { BooleanColumn } from '../../../components';
import { ResourcesListCard } from '../../../layout';
import { SourceListProps } from './types';

export default class SourcesList extends React.PureComponent<SourceListProps> {
  onSourceClick = (id: string) => this.props.history.push(`/sources/${id}`);

  render() {
    return (
      <ResourcesListCard
        list={this.props.sources.nodes}
        onResourceClick={this.onSourceClick}
        resourceType="source"
        deleteHandle={this.props.removeSource}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Harvest mode" dataKey="harvestMode" />
        <BooleanColumn width={50} label="Enabled" dataKey="enabled" iconTrue="done" />
      </ResourcesListCard>
    );
  }
}
